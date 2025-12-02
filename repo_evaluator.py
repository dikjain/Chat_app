#!/usr/bin/env python3
"""

Analyzes repositories for SWE-Bench+ sample creation suitability by combining:
- Repository-level metrics (file structure, test coverage, CI/CD, etc.)
- PR-level analysis with detailed rejection tracking

Usage:
    # With GitHub token (for private repos or higher rate limits)
    python repo_evaluator.py owner/repo-name --github-token $GITHUB_TOKEN

Example:
    python repo_evaluator.py microsoft/vscode --github-token $GITHUB_TOKEN
"""

import os
import json
import sys
import re
import subprocess
import argparse
import logging
import tempfile
import shutil
from pathlib import Path
from typing import Dict, List, Optional, Any, Tuple
from dataclasses import dataclass, asdict
from datetime import datetime, timezone

try:
    from .repo_evaluator_helpers import (
    load_language_config,
    get_language_config,
    is_english,
    is_test_file_path,
    is_asset_file_path,
    get_full_patch_content,
    has_sufficient_code_changes,
    has_rust_embedded_tests,
    normalize_to_utc,
    HEADERS,
    extract_issue_number_from_pr_body,
    fetch_issue_details_rest,
    has_valid_issue_word_count,
    count_words,
    MIN_ISSUE_WORDS,
    MAX_ISSUE_WORDS
)
except Exception:
    from repo_evaluator_helpers import (
    load_language_config,
    get_language_config,
    is_english,
    is_test_file_path,
    is_asset_file_path,
    get_full_patch_content,
    has_sufficient_code_changes,
    has_rust_embedded_tests,
    normalize_to_utc,
    HEADERS,
    extract_issue_number_from_pr_body,
    fetch_issue_details_rest,
    has_valid_issue_word_count,
    count_words,
    MIN_ISSUE_WORDS,
    MAX_ISSUE_WORDS
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Default configuration
MIN_PR_CODE_CHANGES = 1
MIN_TEST_FILES = 1
MAX_NON_TEST_FILES = 100


# Data classes
@dataclass
class RepoMetrics:
    """Repository-level metrics."""
    repo_name: str
    total_files: int
    test_files: int
    test_file_ratio: float
    source_files: int
    total_loc: int
    source_loc: int
    test_loc: int
    languages: Dict[str, int]
    primary_language: str
    has_ci_cd: bool
    ci_files: List[str]
    test_frameworks: List[str]
    has_test_runner: bool
    total_commits: Optional[int]
    recent_commits_6mo: Optional[int]
    commits_referencing_issues: int
    test_coverage_percentage: Optional[float]
    swebench_readiness_score: float
    recommendation: str
    strengths: List[str]
    weaknesses: List[str]


@dataclass
class PRRejectionStats:
    """PR rejection statistics."""
    total_prs: int
    accepted: int
    rejected: int
    acceptance_rate: float
    rejection_breakdown: Dict[str, Dict[str, Any]]


@dataclass
class AnalysisReport:
    """Complete analysis report."""
    repo_name: str
    repo_full_name: str
    repo_metrics: RepoMetrics
    pr_analysis: PRRejectionStats
    overall_score: float
    recommendation: str


# Repository Analyzer
class RepoAnalyzer:
    """Analyze repository structure and metrics."""

    LANGUAGE_EXTENSIONS = {
        'Python': ['.py'],
        'JavaScript': ['.js', '.jsx', '.mjs'],
        'TypeScript': ['.ts', '.tsx'],
        'Java': ['.java'],
        'Scala': ['.scala'],
        'C++': ['.cpp', '.cc', '.cxx', '.hpp', '.h'],
        'C': ['.c', '.h'],
        'Go': ['.go'],
        'Rust': ['.rs'],
        'Ruby': ['.rb'],
        'PHP': ['.php'],
        'C#': ['.cs'],
        'Swift': ['.swift'],
        'Kotlin': ['.kt'],
    }

    TEST_PATTERNS = [
        r'test.*\.py$', r'.*_test\.py$',
        r'.*\.test\.(js|ts|jsx|tsx)$', r'.*\.spec\.(js|ts|jsx|tsx)$',
        r'test/.*', r'tests/.*', r'__tests__/.*',
        r'.*Test\.(java|scala)$', r'.*Spec\.(java|scala)$',
    ]

    CI_FILES = [
        '.github/workflows', '.gitlab-ci.yml', '.travis.yml',
        'Jenkinsfile', '.circleci', 'azure-pipelines.yml', '.drone.yml', 'buildkite.yml',
    ]

    TEST_FRAMEWORKS = {
        'pytest': ['pytest', 'pyproject.toml', 'pytest.ini', 'setup.cfg'],
        'unittest': ['unittest'],
        'jest': ['jest.config', 'package.json'],
        'mocha': ['mocha', '.mocharc', 'package.json'],
        'vitest': ['vitest.config', 'package.json'],
        'junit': ['junit', 'build.gradle', 'pom.xml'],
        'scalatest': ['scalatest', 'build.gradle', 'build.sbt'],
        'rspec': ['rspec', '.rspec', 'spec/'],
        'go test': ['_test.go'],
        'cargo test': ['Cargo.toml'],
    }

    def __init__(self, repo_path: str, owner: Optional[str] = None, repo_name: Optional[str] = None, github_token: Optional[str] = None):
        self.repo_path = Path(repo_path).resolve()
        if not self.repo_path.exists():
            raise ValueError(f"Repository path does not exist: {repo_path}")
        self.repo_name = self.repo_path.name
        self.is_git_repo = (self.repo_path / '.git').exists()
        self.owner = owner
        self.repo_name_github = repo_name
        self.github_token = github_token

    def analyze(self) -> RepoMetrics:
        """Run full repository analysis."""
        logger.info(f"Analyzing repository: {self.repo_name}")

        files = self._get_all_files()
        total_files = len(files)

        language_counts = self._count_by_language(files)
        primary_language = max(language_counts.items(), key=lambda x: x[1])[
            0] if language_counts else "Unknown"

        source_files = self._count_source_files(files, language_counts)
        test_files = self._find_test_files(files)
        test_file_ratio = len(test_files) / \
            total_files if total_files > 0 else 0

        loc_counts = self._count_lines_of_code(files)
        ci_files = self._find_ci_files()
        has_ci_cd = len(ci_files) > 0
        test_frameworks = self._detect_test_frameworks()
        has_test_runner = len(test_frameworks) > 0

        git_metrics = self._analyze_git_history() if self.is_git_repo else {}

        # Try to find coverage reports
        test_coverage = self._find_coverage_reports()

        score_data = self._calculate_score(
            test_file_ratio=test_file_ratio,
            has_ci_cd=has_ci_cd,
            has_test_runner=has_test_runner,
            test_frameworks=test_frameworks,
            git_metrics=git_metrics,
            primary_language=primary_language,
            test_coverage=test_coverage,
        )

        return RepoMetrics(
            repo_name=self.repo_name,
            total_files=total_files,
            test_files=len(test_files),
            test_file_ratio=test_file_ratio,
            source_files=source_files,
            total_loc=loc_counts['total_loc'],
            source_loc=loc_counts['source_loc'],
            test_loc=loc_counts['test_loc'],
            languages=language_counts,
            primary_language=primary_language,
            has_ci_cd=has_ci_cd,
            ci_files=ci_files,
            test_frameworks=test_frameworks,
            has_test_runner=has_test_runner,
            total_commits=git_metrics.get('total_commits'),
            recent_commits_6mo=git_metrics.get('recent_commits_6mo'),
            commits_referencing_issues=git_metrics.get(
                'commits_referencing_issues', 0),
            test_coverage_percentage=test_coverage,
            swebench_readiness_score=score_data['score'],
            recommendation=score_data['recommendation'],
            strengths=score_data['strengths'],
            weaknesses=score_data['weaknesses'],
        )

    def _get_all_files(self) -> List[Path]:
        """Get all files in repository."""
        files = []
        if self.is_git_repo:
            try:
                result = subprocess.run(
                    ['git', 'ls-files'],
                    cwd=self.repo_path,
                    capture_output=True,
                    text=True,
                    timeout=30
                )
                if result.returncode == 0:
                    files = [self.repo_path /
                             f for f in result.stdout.strip().split('\n') if f]
                    return files
            except Exception:
                pass

        ignore_dirs = {'.git', 'node_modules', '__pycache__',
                       '.venv', 'venv', 'dist', 'build', '.gradle', 'target'}
        for root, dirs, filenames in os.walk(self.repo_path):
            dirs[:] = [d for d in dirs if d not in ignore_dirs]
            for filename in filenames:
                files.append(Path(root) / filename)
        return files

    def _count_by_language(self, files: List[Path]) -> Dict[str, int]:
        """Count files by language."""
        counts = {}
        for file_path in files:
            ext = file_path.suffix.lower()
            for language, extensions in self.LANGUAGE_EXTENSIONS.items():
                if ext in extensions:
                    counts[language] = counts.get(language, 0) + 1
                    break
        return dict(sorted(counts.items(), key=lambda x: x[1], reverse=True))

    def _count_source_files(self, files: List[Path], language_counts: Dict[str, int]) -> int:
        """Count source files."""
        code_extensions = set()
        for lang in ['Python', 'JavaScript', 'TypeScript', 'Java', 'Scala', 'Go', 'Rust', 'C++', 'C']:
            if lang in language_counts:
                code_extensions.update(self.LANGUAGE_EXTENSIONS[lang])

        source_count = 0
        for file_path in files:
            ext = file_path.suffix.lower()
            if ext in code_extensions:
                rel_path = str(file_path.relative_to(self.repo_path))
                if not any(re.search(pattern, rel_path) for pattern in self.TEST_PATTERNS):
                    if not any(name in rel_path for name in ['config', 'setup', '__init__']):
                        source_count += 1
        return source_count

    def _count_lines_of_code(self, files: List[Path]) -> Dict[str, int]:
        """Count lines of code."""
        code_extensions = set()
        for lang in ['Python', 'JavaScript', 'TypeScript', 'Java', 'Scala', 'Go', 'Rust', 'C++', 'C', 'Ruby', 'PHP', 'C#', 'Swift', 'Kotlin']:
            code_extensions.update(self.LANGUAGE_EXTENSIONS.get(lang, []))

        total_loc = 0
        source_loc = 0
        test_loc = 0

        for file_path in files:
            ext = file_path.suffix.lower()
            if ext in code_extensions:
                try:
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        lines = [line for line in f if line.strip()]
                        loc = len(lines)

                    total_loc += loc
                    rel_path = str(file_path.relative_to(self.repo_path))
                    is_test = any(re.search(pattern, rel_path)
                                  for pattern in self.TEST_PATTERNS)

                    if is_test:
                        test_loc += loc
                    else:
                        source_loc += loc
                except Exception:
                    pass

        return {'total_loc': total_loc, 'source_loc': source_loc, 'test_loc': test_loc}

    def _find_test_files(self, files: List[Path]) -> List[Path]:
        """Find test files."""
        test_files = []
        for file_path in files:
            rel_path = str(file_path.relative_to(self.repo_path))
            if any(re.search(pattern, rel_path) for pattern in self.TEST_PATTERNS):
                test_files.append(file_path)
        return test_files

    def _find_ci_files(self) -> List[str]:
        """Find CI/CD files."""
        ci_files = []
        for ci_path in self.CI_FILES:
            full_path = self.repo_path / ci_path
            if full_path.exists():
                ci_files.append(ci_path)
        return ci_files

    def _detect_test_frameworks(self) -> List[str]:
        """Detect test frameworks."""
        frameworks = []
        for framework, indicators in self.TEST_FRAMEWORKS.items():
            for indicator in indicators:
                if '/' in indicator or '.' in indicator:
                    if (self.repo_path / indicator).exists():
                        if framework not in frameworks:
                            frameworks.append(framework)
                        break
                else:
                    config_files = ['package.json', 'pyproject.toml', 'requirements.txt',
                                    'build.gradle', 'pom.xml', 'Cargo.toml', 'go.mod']
                    for config_file in config_files:
                        config_path = self.repo_path / config_file
                        if config_path.exists():
                            try:
                                content = config_path.read_text()
                                if indicator in content:
                                    if framework not in frameworks:
                                        frameworks.append(framework)
                                    break
                            except Exception:
                                pass
        return frameworks

    def _find_coverage_reports(self) -> Optional[float]:
        """Find and parse coverage reports if available."""
        # Common coverage report locations
        coverage_paths = [
            self.repo_path / 'coverage.xml',
            self.repo_path / 'coverage' / 'coverage.xml',
            self.repo_path / 'coverage' / 'cobertura.xml',
            self.repo_path / 'htmlcov' / 'coverage.xml',
            self.repo_path / '.coverage.xml',
            self.repo_path / 'lcov.info',
            self.repo_path / 'coverage' / 'lcov.info',
            self.repo_path / 'coverage-final.json',
            self.repo_path / 'coverage' / 'coverage-final.json',
            self.repo_path / '.nyc_output' / 'coverage-final.json',
        ]

        for cov_path in coverage_paths:
            if not cov_path.exists():
                continue

            try:
                # Try parsing coverage.xml (Cobertura format)
                if cov_path.suffix == '.xml':
                    coverage = self._parse_coverage_xml(cov_path)
                    if coverage is not None:
                        logger.info(
                            f"Found coverage report: {cov_path} ({coverage:.1f}% coverage)")
                        return coverage

                # Try parsing lcov.info
                elif cov_path.name == 'lcov.info':
                    coverage = self._parse_lcov_info(cov_path)
                    if coverage is not None:
                        logger.info(
                            f"Found coverage report: {cov_path} ({coverage:.1f}% coverage)")
                        return coverage

                # Try parsing coverage-final.json (Istanbul/NYC)
                elif cov_path.name == 'coverage-final.json':
                    coverage = self._parse_coverage_json(cov_path)
                    if coverage is not None:
                        logger.info(
                            f"Found coverage report: {cov_path} ({coverage:.1f}% coverage)")
                        return coverage
            except Exception as e:
                logger.debug(
                    f"Failed to parse coverage report {cov_path}: {e}")
                continue

        return None

    def _parse_coverage_xml(self, xml_path: Path) -> Optional[float]:
        """Parse Cobertura XML coverage report."""
        try:
            import xml.etree.ElementTree as ET
            tree = ET.parse(xml_path)
            root = tree.getroot()

            # Cobertura format: <coverage line-rate="0.85" branch-rate="0.70">
            line_rate = root.get('line-rate')
            if line_rate:
                return float(line_rate) * 100

            # Alternative: calculate from packages
            total_lines = 0
            covered_lines = 0
            for package in root.findall('.//package'):
                for class_elem in package.findall('.//class'):
                    for line in class_elem.findall('.//line'):
                        total_lines += 1
                        if line.get('hits') and int(line.get('hits', 0)) > 0:
                            covered_lines += 1

            if total_lines > 0:
                return (covered_lines / total_lines) * 100
        except Exception as e:
            logger.debug(f"Error parsing XML coverage: {e}")
        return None

    def _parse_lcov_info(self, lcov_path: Path) -> Optional[float]:
        """Parse LCOV info coverage report."""
        try:
            total_lines = 0
            covered_lines = 0

            with open(lcov_path, 'r') as f:
                for line in f:
                    line = line.strip()
                    # LCOV format: DA:<line_number>,<execution_count>
                    if line.startswith('DA:'):
                        parts = line[3:].split(',')
                        if len(parts) == 2:
                            total_lines += 1
                            try:
                                if int(parts[1]) > 0:
                                    covered_lines += 1
                            except ValueError:
                                pass
                    # Use summary at end_of_record if available (more accurate)
                    elif line.startswith('LF:'):
                        # LF: total lines found
                        try:
                            lf_value = int(line.split(':')[1])
                            # Use summary if we haven't counted many lines yet
                            if total_lines < 100:  # Prefer summary for large files
                                total_lines = lf_value
                        except (ValueError, IndexError):
                            pass
                    elif line.startswith('LH:'):
                        # LH: lines hit
                        try:
                            lh_value = int(line.split(':')[1])
                            # Use summary if we haven't counted many lines yet
                            if covered_lines < 100:  # Prefer summary for large files
                                covered_lines = lh_value
                        except (ValueError, IndexError):
                            pass

            if total_lines > 0:
                return (covered_lines / total_lines) * 100
        except Exception as e:
            logger.debug(f"Error parsing LCOV coverage: {e}")
        return None

    def _parse_coverage_json(self, json_path: Path) -> Optional[float]:
        """Parse Istanbul/NYC coverage-final.json report."""
        try:
            with open(json_path, 'r') as f:
                data = json.load(f)

            total_statements = 0
            covered_statements = 0

            # NYC format: { "path/to/file.js": { "s": { "1": 1, "2": 0, ... } } }
            for file_path, file_data in data.items():
                # Skip test files and node_modules
                if 'test' in file_path.lower() or 'node_modules' in file_path:
                    continue

                statements = file_data.get('s', {})
                for stmt_id, count in statements.items():
                    total_statements += 1
                    if count and count > 0:
                        covered_statements += 1

            if total_statements > 0:
                return (covered_statements / total_statements) * 100
        except Exception as e:
            logger.debug(f"Error parsing JSON coverage: {e}")
        return None

    def _fetch_total_commits_from_api(self) -> Optional[int]:
        """Fetch total commit count from GitHub API."""
        import requests

        headers = HEADERS.copy()
        if self.github_token:
            headers["Authorization"] = f"Bearer {self.github_token}"

        try:
            # Use GitHub API to get commit count
            # We use per_page=1 to minimize data transfer, then parse Link header for pagination
            url = f"https://api.github.com/repos/{self.owner}/{self.repo_name_github}/commits"
            params = {"per_page": 1}

            response = requests.get(
                url, headers=headers, params=params, timeout=30)
            response.raise_for_status()

            # Get total count from Link header if available
            link_header = response.headers.get('Link', '')
            if link_header:
                # Parse Link header to find last page
                # Format: <https://api.github.com/repos/.../commits?page=123>; rel="last"
                import re
                last_match = re.search(
                    r'<[^>]+[?&]page=(\d+)>; rel="last"', link_header)
                if last_match:
                    last_page = int(last_match.group(1))
                    # Get the last page to count items on it
                    last_response = requests.get(url, headers=headers, params={
                                                 "per_page": 1, "page": last_page}, timeout=30)
                    last_response.raise_for_status()
                    last_page_data = last_response.json()
                    # Total = (pages before last) * per_page + items on last page
                    total = (last_page - 1) * 1 + len(last_page_data)
                    logger.info(f"Fetched total commits from API: {total}")
                    return total

            # Fallback: if no pagination header, check if there's only one page
            data = response.json()
            if len(data) == 0:
                return 0
            elif len(data) == 1:
                # Might be only one commit, or might be paginated but no Link header
                # Try to get page 2 to see if there are more
                page2_response = requests.get(url, headers=headers, params={
                                              "per_page": 1, "page": 2}, timeout=30)
                if page2_response.status_code == 200:
                    page2_data = page2_response.json()
                    if len(page2_data) > 0:
                        # There are more pages, but no Link header - can't determine total accurately
                        logger.warning(
                            "Could not determine total commits: pagination exists but no Link header")
                        return None
                # Only one page with commits
                return 1

        except Exception as e:
            logger.debug(f"Error fetching total commits from API: {e}")

        return None

    def _analyze_git_history(self) -> Dict[str, Any]:
        """Analyze git history."""
        metrics = {}
        try:
            result = subprocess.run(
                ['git', 'rev-list', '--count', 'HEAD'],
                cwd=self.repo_path,
                capture_output=True,
                text=True,
                timeout=30
            )
            if result.returncode == 0:
                metrics['total_commits'] = int(result.stdout.strip())

            result = subprocess.run(
                ['git', 'rev-list', '--count', '--since=6.months.ago', 'HEAD'],
                cwd=self.repo_path,
                capture_output=True,
                text=True,
                timeout=30
            )
            if result.returncode == 0:
                metrics['recent_commits_6mo'] = int(result.stdout.strip())

            result = subprocess.run(
                ['git', 'log', '--all', '--oneline', '--grep=#[0-9]'],
                cwd=self.repo_path,
                capture_output=True,
                text=True,
                timeout=30
            )
            if result.returncode == 0:
                metrics['commits_referencing_issues'] = len(
                    result.stdout.strip().split('\n')) if result.stdout.strip() else 0
        except Exception as e:
            logger.warning(f"Could not analyze git history: {e}")

        return metrics

    def _calculate_score(
        self,
        test_file_ratio: float,
        has_ci_cd: bool,
        has_test_runner: bool,
        test_frameworks: List[str],
        git_metrics: Dict[str, Any],
        primary_language: str,
        test_coverage: Optional[float] = None,
    ) -> Dict[str, Any]:
        """Calculate SWE-bench readiness score."""
        score = 0.0
        strengths = []
        weaknesses = []

        # Test coverage (40 points max)
        # Use actual coverage percentage if available, otherwise fall back to file ratio
        if test_coverage is not None:
            # Use actual coverage percentage (0-100 scale)
            # 100% coverage = 40 points
            test_score = min(test_coverage * 0.4, 40)
            score += test_score
            if test_coverage >= 80:
                strengths.append(
                    f"Excellent test coverage ({test_coverage:.1f}%)")
            elif test_coverage >= 60:
                strengths.append(f"Good test coverage ({test_coverage:.1f}%)")
            elif test_coverage >= 40:
                strengths.append(
                    f"Moderate test coverage ({test_coverage:.1f}%)")
            else:
                weaknesses.append(f"Low test coverage ({test_coverage:.1f}%)")
        else:
            # Fallback to file ratio
            test_score = min(test_file_ratio * 400, 40)
            score += test_score
            if test_file_ratio >= 0.10:
                strengths.append(
                    f"Good test file ratio ({test_file_ratio*100:.1f}%)")
            elif test_file_ratio >= 0.05:
                strengths.append(
                    f"Moderate test file ratio ({test_file_ratio*100:.1f}%)")
            else:
                weaknesses.append(
                    f"Low test file ratio ({test_file_ratio*100:.1f}%)")

        # CI/CD (15 points)
        if has_ci_cd:
            score += 15
            strengths.append("CI/CD pipeline configured")
        else:
            weaknesses.append("No CI/CD pipeline detected")

        # Test runner (15 points)
        if has_test_runner:
            score += 15
            strengths.append(f"Test frameworks: {', '.join(test_frameworks)}")
        else:
            weaknesses.append("No test framework detected")

        # Git activity (15 points)
        if git_metrics.get('recent_commits_6mo', 0) > 10:
            score += 15
            strengths.append(
                f"Active development ({git_metrics['recent_commits_6mo']} commits in 6mo)")
        elif git_metrics.get('recent_commits_6mo', 0) > 0:
            score += 7
            strengths.append(
                f"Some recent activity ({git_metrics['recent_commits_6mo']} commits in 6mo)")
        else:
            weaknesses.append("No recent commits (last 6 months)")

        # Issue tracking (15 points)
        issue_refs = git_metrics.get('commits_referencing_issues', 0)
        if issue_refs > 20:
            score += 15
            strengths.append(
                f"Good issue tracking ({issue_refs} commits reference issues)")
        elif issue_refs > 5:
            score += 10
            strengths.append(
                f"Some issue tracking ({issue_refs} commits reference issues)")
        elif issue_refs > 0:
            score += 5
        else:
            weaknesses.append("Few/no commits reference issues")

        # Recommendation
        if score >= 70:
            recommendation = "🌟 EXCELLENT - Highly suitable for SWE-Bench+ samples"
        elif score >= 50:
            recommendation = "✅ GOOD - Suitable for SWE-Bench+ samples with some limitations"
        elif score >= 30:
            recommendation = "⚠️  FAIR - May be suitable but has significant gaps"
        else:
            recommendation = "❌ POOR - Not recommended for SWE-Bench+ samples"

        return {
            'score': round(score, 1),
            'recommendation': recommendation,
            'strengths': strengths,
            'weaknesses': weaknesses,
        }


# PR Analyzer
class PRAnalyzer:
    """Analyze PRs with rejection tracking."""

    def __init__(self, owner: str, repo_name: str, github_token: str, language_config: dict,
                 min_test_files: int = MIN_TEST_FILES, max_non_test_files: int = MAX_NON_TEST_FILES,
                 min_code_changes: int = MIN_PR_CODE_CHANGES, start_date: Optional[datetime] = None,
                 ):
        self.owner = owner
        self.repo_name = repo_name
        self.repo_full_name = f"{owner}/{repo_name}"
        self.github_token = github_token
        self.language_config = language_config
        self.min_test_files = min_test_files
        self.max_non_test_files = max_non_test_files
        self.min_code_changes = min_code_changes
        self.start_date = start_date

    def fetch_prs_graphql(self, cursor: Optional[str] = None, page_size: int = 50) -> dict:
        """Fetch PRs using GraphQL API."""
        query = """
            query($queryString: String!, $cursor: String, $page_size: Int!, $owner: String!, $name: String!) {
            repository(owner: $owner, name: $name) {
              primaryLanguage { name }
              owner { login }
              name
            }
            search(query: $queryString, type: ISSUE, first: $page_size, after: $cursor) {
              pageInfo {
                endCursor
                hasNextPage
              }
              nodes {
                ... on PullRequest {
                  number
                  title
                  body
                  baseRefOid
                  headRefOid
                  mergedAt
                  createdAt
                  url
                  baseRepository {
                    nameWithOwner
                  }
                  headRepository {
                    nameWithOwner
                  }
                  files(first: 100) {
                    nodes {
                      path
                      changeType
                      additions
                      deletions
                    }
                  }
                  closingIssuesReferences(first: 10) {
                    nodes {
                      url
                      number
                      title
                      body
                      state
                      __typename
                    }
                  }
                }
              }
            }
          }
        """
        varibales = {
            "owner": self.owner,
            "name": self.repo_name,
            "queryString": f"repo:{self.owner}/{self.repo_name} is:pr is:merged sort:created-desc",
            "cursor": cursor,
            "page_size": page_size
        }

        import requests
        headers = HEADERS.copy()
        if self.github_token:
            headers["Authorization"] = f"Bearer {self.github_token}"

        response = requests.post(
            "https://api.github.com/graphql",
            json={"query": query, "variables": varibales},
            headers=headers,
            timeout=30
        )
        response.raise_for_status()
        return response.json()

    def analyze_prs(self, max_prs: Optional[int] = None) -> PRRejectionStats:
        """Analyze PRs and track rejections."""
        logger.info(f"Analyzing PRs for {self.repo_full_name}...")

        cursor = None
        total_prs = 0
        accepted = 0
        rejected = 0
        rejection_reasons = {}

        while True:
            try:
                res = self.fetch_prs_graphql(cursor, page_size=50)

                if res.get('errors'):
                    error_msg = res['errors'][0]['message']
                    # Check for rate limit in GraphQL errors
                    if "rate limit" in error_msg.lower() or "403" in error_msg:
                        logger.error(
                            f"GitHub API rate limit exceeded. Please provide a GitHub token using --github-token")
                    logger.error(f"GraphQL error: {error_msg}")
                    break

                repo_data = res.get('data', {}).get('repository', {})
                search_data = res.get('data', {}).get('search', {})
                language_name = repo_data.get(
                    'primaryLanguage', {}).get('name', None)
                pr_nodes = search_data.get('nodes', [])
                page_info = search_data.get('pageInfo', {})

                if not pr_nodes:
                    break

                for pr_data in pr_nodes:
                    if max_prs and total_prs >= max_prs:
                        break

                    logger.info(f"Processing PR #{pr_data['number']}...")

                    pr_created_at = normalize_to_utc(
                        datetime.fromisoformat(pr_data['createdAt'].replace('Z', '+00:00')))
                    pr_merged_at = normalize_to_utc(
                        datetime.fromisoformat(pr_data['mergedAt'].replace('Z', '+00:00')))
                    pr_number = pr_data['number']

                    total_prs += 1

                    # Apply filters
                    failed_filter = None
                    filter_reason = None

                    # Date filters
                    if self.start_date and pr_merged_at < self.start_date:
                        failed_filter = "merge_date"
                        filter_reason = f"PR merged {pr_merged_at.date()} before start date {self.start_date.date()}"
                    elif pr_created_at is None:
                        failed_filter = "creation_date"
                        filter_reason = "PR has no createdAt date"

                    # Content filter
                    if not failed_filter:
                        pr_body = pr_data.get('body', '') or ''
                        if not (is_english(pr_data.get('title', '')) and is_english(pr_body)):
                            failed_filter = "content_not_in_english"
                            filter_reason = "Content may not be in English"

                    # Closing issues validation
                    if not failed_filter:
                        closing_issues = pr_data.get('closingIssuesReferences', {}).get('nodes', [])

                        # If no closing issues from GraphQL, try regex extraction from PR body
                        if not closing_issues:
                            regex_issue_number, regex_rejection_reason = extract_issue_number_from_pr_body(pr_body, pr_number)
                            if regex_issue_number:
                                logger.info(f"PR #{pr_number}: Using regex fallback for issue #{regex_issue_number} via REST API.")
                                try:
                                    issue_data_from_rest = fetch_issue_details_rest(
                                        self.owner, self.repo_name, int(regex_issue_number), self.github_token)
                                    if issue_data_from_rest:
                                        closing_issues.append(issue_data_from_rest)
                                except Exception as e:
                                    logger.warning(f"Failed to fetch fallback issue #{regex_issue_number} via REST API: {e}")

                        # If we have closing issues, validate them
                        if closing_issues:
                            found_valid_issue = False
                            for issue_data in closing_issues:
                                issue_number = issue_data.get('number')
                                issue_typename = issue_data.get('__typename', 'Issue')

                                # Check if issue is not a PR
                                if issue_typename == 'PullRequest':
                                    continue  # Skip this issue, try next one

                                # Check if issue is closed
                                issue_state = issue_data.get('state', '').lower()
                                if issue_state != 'closed':
                                    continue  # Skip this issue, try next one

                                # Check word count
                                issue_body = issue_data.get('body', '') or ''
                                if not has_valid_issue_word_count(issue_body):
                                    continue  # Skip this issue, try next one

                                # If we get here, this issue passed all validations
                                found_valid_issue = True
                                break  # Found a valid issue, no need to check others

                            # If no issue passed validation, reject the PR
                            if not found_valid_issue:
                                # Use the first issue's failure reason (or a generic one)
                                first_issue = closing_issues[0]
                                issue_number = first_issue.get('number')
                                issue_typename = first_issue.get('__typename', 'Issue')

                                if issue_typename == 'PullRequest':
                                    failed_filter = "issue_is_a_pr"
                                    filter_reason = f"Linked issue #{issue_number} is a Pull Request"
                                else:
                                    issue_state = first_issue.get('state', '').lower()
                                    if issue_state != 'closed':
                                        failed_filter = "issue_is_not_closed"
                                        filter_reason = f"Linked issue #{issue_number} is not closed (state: {issue_state})"
                                    else:
                                        issue_body = first_issue.get('body', '') or ''
                                        word_count = count_words(issue_body)
                                        failed_filter = "issue_word_count"
                                        filter_reason = f"Issue #{issue_number} word count ({word_count}) is outside {MIN_ISSUE_WORDS}-{MAX_ISSUE_WORDS} range"
                        # If no closing issues found at all, continue with PR analysis (don't reject)

                    # File filters
                    if not failed_filter:
                        pr_files_nodes = pr_data.get(
                            'files', {}).get('nodes', [])
                        test_files = [f for f in pr_files_nodes if is_test_file_path(
                            f['path'], self.language_config) and not is_asset_file_path(f['path'], self.language_config)]
                        non_test_files = [f for f in pr_files_nodes if not is_test_file_path(
                            f['path'], self.language_config) and not is_asset_file_path(f['path'], self.language_config)]

                        if len(test_files) < self.min_test_files:
                            failed_filter = "fewer_than_min_test_files"
                            filter_reason = f"PR has fewer than {self.min_test_files} test files"
                        elif len(non_test_files) > self.max_non_test_files:
                            failed_filter = "more_than_max_non_test_files"
                            filter_reason = f"PR has more than {self.max_non_test_files} non-test files"

                    # Code changes filter (requires patch)
                    if not failed_filter:
                        try:
                            full_patch = get_full_patch_content(
                                self.repo_full_name,
                                pr_data['baseRefOid'],
                                pr_data['headRefOid'],
                                token=self.github_token
                            )
                            if not full_patch:
                                failed_filter = "full_patch_retrieval"
                                filter_reason = "Could not retrieve full patch"
                            else:
                                # Rust embedded tests check
                                if language_name == "Rust" and has_rust_embedded_tests(pr_files_nodes, full_patch, self.language_config):
                                    failed_filter = "rust_embedded_tests"
                                    filter_reason = "Rust files contain embedded tests"
                                else:
                                    # Check code changes
                                    has_sufficient, source_changes = has_sufficient_code_changes(
                                        self.repo_full_name,
                                        pr_data['baseRefOid'],
                                        pr_data['headRefOid'],
                                        self.language_config,
                                        self.min_code_changes,
                                        full_patch=full_patch,
                                        token=self.github_token
                                    )
                                    if not has_sufficient:
                                        failed_filter = "code_changes_not_sufficient"
                                        filter_reason = f"Code changes {source_changes} below {self.min_code_changes}"
                        except Exception as e:
                            logger.warning(
                                f"Error processing PR #{pr_number}: {e}")
                            failed_filter = "pr_processing_error"
                            filter_reason = f"Exception during processing: {str(e)}"

                    # Track results
                    if failed_filter:
                        rejected += 1
                        rejection_reasons[failed_filter] = rejection_reasons.get(
                            failed_filter, 0) + 1
                        logger.info(
                            f"PR #{pr_number} rejected: {failed_filter} - {filter_reason}")
                    else:
                        accepted += 1
                        logger.info(f"PR #{pr_number} accepted")

                if max_prs and total_prs >= max_prs:
                    break

                if not page_info.get('hasNextPage'):
                    break
                cursor = page_info.get('endCursor')

            except Exception as e:
                error_str = str(e)
                # Check for rate limit errors
                if "rate limit" in error_str.lower() or "403" in error_str:
                    logger.error(
                        f"GitHub API rate limit exceeded. Please provide a GitHub token using --github-token")
                    logger.error(f"Error: {e}")
                else:
                    logger.error(
                        f"Error fetching PRs from {self.repo_full_name} for cursor {cursor}: {e}")
                break

        # Build rejection breakdown
        rejection_breakdown = {}
        for filter_name, count in rejection_reasons.items():
            rejection_breakdown[filter_name] = {
                'count': count,
                'percentage': round((count / rejected * 100) if rejected > 0 else 0, 1)
            }

        acceptance_rate = (accepted / total_prs) if total_prs > 0 else 0.0

        return PRRejectionStats(
            total_prs=total_prs,
            accepted=accepted,
            rejected=rejected,
            acceptance_rate=round(acceptance_rate, 3),
            rejection_breakdown=rejection_breakdown
        )


class RepoEvaluator:
    def __init__(self, repo_path: str, owner: str, repo_name: str,
                 github_token: Optional[str] = None,
                 min_test_files: int = MIN_TEST_FILES,
                 max_non_test_files: int = MAX_NON_TEST_FILES,
                 min_code_changes: int = MIN_PR_CODE_CHANGES,
                 start_date: Optional[datetime] = None,
                 max_prs: Optional[int] = None):
        self.repo_path = repo_path
        self.owner = owner
        self.repo_name = repo_name
        self.repo_full_name = f"{owner}/{repo_name}"
        self.github_token = github_token

        self.min_test_files = min_test_files
        self.max_non_test_files = max_non_test_files
        self.min_code_changes = min_code_changes
        self.start_date = start_date
        self.max_prs = max_prs

        self.language_config = load_language_config()

    def evaluate(self) -> AnalysisReport:
        if not self.github_token:
            raise ValueError("Github token is required to prevent rate limit errors")
        if not self.owner:
            raise ValueError("Owner is required")
        if not self.repo_name:
            raise ValueError("Repository name is required")

        logger.info(f"Evaluating repository: {self.repo_full_name}")

        repo_analyzer = RepoAnalyzer(
            repo_path=self.repo_path,
            owner=self.owner,
            repo_name=self.repo_name,
            github_token=self.github_token
        )
        repo_metrics = repo_analyzer.analyze()

        primary_language = repo_metrics.primary_language
        if primary_language in ["Vue", "React"]:
            primary_language = "TypeScript"

        language_config = get_language_config(primary_language)
        if not language_config:
            logger.warning(
                f"Language '{primary_language}' not found, using generic fallback")
            language_config = get_language_config(
                "Unknown")  # Generic fallback

        pr_analyzer = PRAnalyzer(
            owner=self.owner,
            repo_name=self.repo_name,
            github_token=self.github_token,
            language_config=language_config,
            min_test_files=self.min_test_files,
            max_non_test_files=self.max_non_test_files,
            min_code_changes=self.min_code_changes,
            start_date=self.start_date,
        )

        try:
            pr_analysis = pr_analyzer.analyze_prs(max_prs=self.max_prs)
            if pr_analysis.total_prs == 0:
                logger.warning("No PRs were analyzed. This could be due to:")
                logger.warning(
                    "Rate limit exceeded (provide --github-token)") if not self.github_token else None
                logger.warning("No merged PRs found in the repository")
                logger.warning("API access issues")
        except Exception as e:
            logger.error(f"Error analyzing PRs: {e}")
            import traceback
            logger.debug(traceback.format_exc())
            pr_analysis = PRRejectionStats(
                total_prs=0,
                accepted=0,
                rejected=0,
                acceptance_rate=0.0,
                rejection_breakdown={}
            )

        # Calculate overall score (weighted: 60% repo, 40% PR acceptance rate)
        repo_score = repo_metrics.swebench_readiness_score
        pr_score = pr_analysis.acceptance_rate * \
            100 if pr_analysis.total_prs > 0 else 0
        overall_score = (repo_score * 0.6) + (pr_score * 0.4)

        # Overall recommendation
        if overall_score >= 70:
            recommendation = "🌟 GREAT"
        elif overall_score >= 50:
            recommendation = "✅ GOOD"
        elif overall_score >= 30:
            recommendation = "⚠️ FAIR"
        else:
            recommendation = "❌ POOR"

        return AnalysisReport(
            repo_name=self.repo_name,
            repo_full_name=self.repo_full_name,
            repo_metrics=repo_metrics,
            pr_analysis=pr_analysis,
            overall_score=overall_score,
            recommendation=recommendation
        )


# Output functions
def print_report(report: AnalysisReport):
    """Print human-readable report to console."""
    print(f"\n{'='*60}")
    print(f"REPOSITORY EVALUATION REPORT")
    print(f"{'='*60}")
    print(f"Repository: {report.repo_full_name}")
    print(f"Language: {report.repo_metrics.primary_language}")
    print(f"Overall Score: {report.overall_score}/100")
    print(f"Recommendation: {report.recommendation}\n")

    print("--- Repository Metrics ---")
    print(f"Total files: {report.repo_metrics.total_files}")
    print(f"Source files: {report.repo_metrics.source_files}")
    print(f"Test files: {report.repo_metrics.test_files}")
    print(
        f"Test coverage ratio: {report.repo_metrics.test_file_ratio*100:.1f}%")
    if report.repo_metrics.test_coverage_percentage is not None:
        print(
            f"Test coverage (from reports): {report.repo_metrics.test_coverage_percentage:.1f}%")
    print(f"Total LoC: {report.repo_metrics.total_loc:,}")
    print(f"Source LoC: {report.repo_metrics.source_loc:,}")
    print(f"Test LoC: {report.repo_metrics.test_loc:,}")
    print(f"CI/CD: {'✅' if report.repo_metrics.has_ci_cd else '❌'}")
    print(
        f"Test frameworks: {', '.join(report.repo_metrics.test_frameworks) if report.repo_metrics.test_frameworks else 'None'}")
    if report.repo_metrics.total_commits:
        print(f"Total commits: {report.repo_metrics.total_commits:,}")
        if report.repo_metrics.recent_commits_6mo:
            print(
                f"Recent commits (6mo): {report.repo_metrics.recent_commits_6mo:,}")

    print(f"\n--- PR Analysis ---")
    print(f"Total PRs Analyzed: {report.pr_analysis.total_prs}")
    print(
        f"Accepted: {report.pr_analysis.accepted} ({report.pr_analysis.acceptance_rate*100:.1f}%)")
    print(
        f"Rejected: {report.pr_analysis.rejected} ({(1-report.pr_analysis.acceptance_rate)*100:.1f}%)")

    if report.pr_analysis.rejection_breakdown:
        print(f"\nRejection Breakdown:")
        # Sort by count descending
        sorted_rejections = sorted(
            report.pr_analysis.rejection_breakdown.items(),
            key=lambda x: x[1]['count'],
            reverse=True
        )
        for filter_name, stats in sorted_rejections:
            print(
                f" {filter_name}: {stats['count']} ({stats['percentage']}%)")

    if report.repo_metrics.strengths:
        print(f"\n--- Strengths ---")
        for strength in report.repo_metrics.strengths:
            print(f" {strength}")

    if report.repo_metrics.weaknesses:
        print(f"\n--- Weaknesses ---")
        for weakness in report.repo_metrics.weaknesses:
            print(f" {weakness}")


def to_json(report: AnalysisReport) -> dict:
    """Convert report to JSON-serializable dict."""
    return {
        'repo_name': report.repo_name,
        'repo_full_name': report.repo_full_name,
        'overall_score': report.overall_score,
        'recommendation': report.recommendation,
        'repo_metrics': asdict(report.repo_metrics),
        'pr_analysis': {
            'total_prs': report.pr_analysis.total_prs,
            'accepted': report.pr_analysis.accepted,
            'rejected': report.pr_analysis.rejected,
            'acceptance_rate': report.pr_analysis.acceptance_rate,
            'rejection_breakdown': report.pr_analysis.rejection_breakdown,
        }
    }


def clone_repo(repo_full_name: str, temp_dir: Path, github_token: str) -> Path:
    """Clone repository to temporary directory."""

    repo_url = f"https://{github_token}@github.com/{repo_full_name}.git"
    clone_path = temp_dir / repo_full_name.replace('/', '_')

    logger.info(f"Cloning {repo_full_name} to {clone_path}...")
    result = subprocess.run(
        # deep clone so we can get the total commits
        ['git', 'clone', repo_url, str(clone_path)],
        capture_output=True,
        text=True,
        timeout=300,
    )

    if result.returncode != 0:
        raise RuntimeError(f"Failed to clone repository: {result.stderr}")

    logger.info(f"Successfully cloned repository")
    return clone_path


def parse_repo_name(repo_string: str) -> Tuple[str, str]:
    """Parse owner/repo-name format."""
    repo_string = repo_string.strip()
    if '/' not in repo_string:
        raise ValueError(
            f"Invalid repo format: {repo_string}. Expected 'owner/repo-name'")

    parts = repo_string.split('/')
    if len(parts) != 2:
        raise ValueError(
            f"Invalid repo format: {repo_string}. Expected 'owner/repo-name'")

    return parts[0], parts[1]


def main():
    parser = argparse.ArgumentParser(
        description='Evaluate repositories for SWE-bench sample creation suitability'
    )
    parser.add_argument(
        'repo',
        help='Repository in format owner/repo-name (e.g., microsoft/vscode)'
    )
    parser.add_argument(
        '--repo-path',
        help='Path to local repository directory (if not provided, will auto-clone)',
        default=None
    )
    parser.add_argument(
        '--github-token',
        help='GitHub token for API access',
        default=None
    )
    parser.add_argument(
        '--min-test-files',
        type=int,
        default=MIN_TEST_FILES,
        help=f'Minimum test files per PR (default: {MIN_TEST_FILES})'
    )
    parser.add_argument(
        '--max-non-test-files',
        type=int,
        default=MAX_NON_TEST_FILES,
        help=f'Maximum non-test files per PR (default: {MAX_NON_TEST_FILES})'
    )
    parser.add_argument(
        '--min-code-changes',
        type=int,
        default=MIN_PR_CODE_CHANGES,
        help=f'Minimum code changes per PR (default: {MIN_PR_CODE_CHANGES})'
    )
    parser.add_argument(
        '--json',
        action='store_true',
        help='Output as JSON'
    )
    parser.add_argument(
        '--max-prs',
        type=int,
        default=None,
        help='Maximum number of PRs to evaluate (default: None)'
    )
    parser.add_argument(
        '--start-date',
        type=str,
        default=None,
        help='Start date for evaluating PRs (YYYY-MM-DD)'
    )
    parser.add_argument(
        '--output',
        type=str,
        default=None,
        help='Output file (default: None)'
    )

    args = parser.parse_args()

    if args.start_date:
        start_date = datetime.strptime(args.start_date, '%Y-%m-%d')
    else:
        start_date = None

    # Parse repo name
    try:
        owner, repo_name = parse_repo_name(args.repo)
    except ValueError as e:
        logger.error(str(e))
        sys.exit(1)

    repo_path = args.repo_path
    temp_dir = None
    should_cleanup = True

    if not repo_path:
        # Auto-clone to temp directory
        temp_dir = Path(tempfile.mkdtemp(prefix='repo_evaluator_'))
        try:
            repo_path = str(clone_repo(
                f"{owner}/{repo_name}", temp_dir, args.github_token))
        except Exception as e:
            logger.error(f"Failed to clone repository: {e}")
            if temp_dir and temp_dir.exists():
                shutil.rmtree(temp_dir, ignore_errors=True)
            sys.exit(1)
    else:
        repo_path = str(Path(repo_path).resolve())
        if not Path(repo_path).exists():
            logger.error(f"Repository path does not exist: {repo_path}")
            sys.exit(1)

    # Run evaluation
    try:
        evaluator = RepoEvaluator(
            repo_path=repo_path,
            owner=owner,
            repo_name=repo_name,
            github_token=args.github_token,
            min_test_files=args.min_test_files,
            max_non_test_files=args.max_non_test_files,
            min_code_changes=args.min_code_changes,
            start_date=start_date,
            max_prs=args.max_prs
        )

        report = evaluator.evaluate()

        # Output
        if args.json:
            output = json.dumps(to_json(report), indent=2)
            if args.output:
                Path(args.output).write_text(output)
                print(f"Results saved to {args.output}")
            else:
                print(output)
                output_dir = Path(os.getcwd() + '/output')
                os.makedirs(output_dir, exist_ok=True)
                filepath = os.path.join(output_dir, Path(f"{args.repo.replace('/', '__')}.json"))

                with open(filepath, 'w') as f:
                    f.write(output)
        else:
            print_report(report)
            if args.output:
                # Save human-readable version
                with open(args.output, 'w') as f:
                    original_stdout = sys.stdout
                    sys.stdout = f
                    print_report(report)
                    sys.stdout = original_stdout
                print(f"\nResults saved to {args.output}")

    except Exception as e:
        logger.error(f"Error evaluating repository: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
    finally:
        if should_cleanup and temp_dir and temp_dir.exists():
            shutil.rmtree(temp_dir, ignore_errors=True)


if __name__ == '__main__':
    main()
