"""
Helper functions for repository evaluation.
"""

import os
import re
from typing import Dict, List, Optional, Tuple
from datetime import timezone

# GitHub API headers
HEADERS = {
    "Accept": "application/vnd.github.v3+json"
}

# Embedded language configuration
_COMMON_TEST_PATTERNS = [
    "/test/", "/tests/", "__tests__", "__test__", ".test.", "_test.", "test_", "_test",
    "test-results", "test-output", "test-results.xml", "testdata", "testcase", "junit.xml",
    "/spec/", "/specs/", ".spec.", "_spec.",
    "__snapshots__", ".snap",
    "/coverage/", "/.nyc_output/", "coverage-final.json", "coverage.xml", "lcov.info",
    ".lcov", ".cov", "lcov-report", "htmlcov", ".nyc_output",
    "surefire-reports", "failsafe-reports",
    "/mocks/", "__mocks__", "/fixtures/",
    ".e2e.", "googletest", "gtest", "catch2"
]

_CONFIG_PATTERNS = [
    ".config", ".conf", ".properties", ".env", ".env.local", ".env.development",
    ".env.production", ".env.test", ".env.example", ".settings", ".prefs", ".rc", ".pro",
    ".mk", ".make", ".cmake", ".gradle", ".sbt", ".json", ".md", ".markdown", ".rst",
    ".yml", ".yaml", ".xml", ".toml", ".ini", ".cfg", ".lock", ".npmrc", ".yarnrc",
    ".npmignore", ".nvmrc", ".gitignore", ".gitattributes", ".gitmodules", ".gitconfig",
    ".editorconfig", ".browserslistrc", ".browserslist", ".prettierrc", ".prettierrc.json",
    ".prettierrc.yml", ".prettierrc.yaml", ".prettierignore", ".eslintrc", ".eslintignore",
    ".eslintrc.json", ".eslintrc.yml", ".eslintrc.yaml", ".eslintrc.cjs", ".eslintrc.mjs",
    ".babelrc", ".stylelintrc", ".stylelintignore", "pytest.ini", "nose.cfg", "karma.conf.js",
    "jest.config", "jest.config.js", "jest.config.ts", "mocha.opts", "vitest.config.",
    "wdio.conf.js", "cypress.config.", "playwright.config.", "readme", "license",
    "changelog", "contributing", ".dockerignore", "makefile", "Makefile", "cmakelists.txt",
    "CMakeLists.txt", "Procfile", "Jenkinsfile", "Vagrantfile", ".codeclimate.yml",
    "sonar-project.properties", ".coveragerc", ".pylintrc", ".flake8", "mypy.ini", "ruff.toml",
    ".travis.yml", "travis.yml", ".circleci", "azure-pipelines.yml", "tslint.json"
]

_BINARY_EXTENSIONS = [
    ".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico", ".pdf", ".zip", ".tar", ".gz",
    ".rar", ".7z", ".exe", ".dll", ".so", ".dylib", ".bin"
]

# Language-specific configuration
_LANGUAGE_CONFIG = {
    "Python": {
        "name": "Python",
        "file_analysis": {
            "source_extensions": [".py"]
        }
    },
    "JavaScript": {
        "name": "JavaScript",
        "file_analysis": {
            "source_extensions": [".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs"]
        }
    },
    "TypeScript": {
        "name": "TypeScript",
        "file_analysis": {
            "source_extensions": [".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"]
        }
    },
    "Java": {
        "name": "Java",
        "file_analysis": {
            "source_extensions": [".java"]
        }
    },
    "Go": {
        "name": "Go",
        "file_analysis": {
            "source_extensions": [".go"]
        }
    },
    "Rust": {
        "name": "Rust",
        "file_analysis": {
            "source_extensions": [".rs"]
        }
    },
    "C++": {
        "name": "C++",
        "file_analysis": {
            "source_extensions": [".c", ".cpp", ".cc", ".cxx", ".h", ".hpp", ".hh", ".hxx", ".inl", ".sql"]
        }
    },
    "C": {
        "name": "C",
        "file_analysis": {
            "source_extensions": [".c", ".cpp", ".cc", ".cxx", ".h", ".hpp", ".hh", ".hxx"]
        }
    },
    "C#": {
        "name": "C#",
        "file_analysis": {
            "source_extensions": [".cs"]
        }
    },
    "Ruby": {
        "name": "Ruby",
        "file_analysis": {
            "source_extensions": [".rb"]
        }
    },
    "PHP": {
        "name": "PHP",
        "file_analysis": {
            "source_extensions": [".php", ".phtml", ".php3", ".php4", ".php5", ".phps"]
        }
    },
    "Scala": {
        "name": "Scala",
        "file_analysis": {
            "source_extensions": [".scala"]
        }
    },
    "Swift": {
        "name": "Swift",
        "file_analysis": {
            "source_extensions": [".swift"]
        }
    },
    "Kotlin": {
        "name": "Kotlin",
        "file_analysis": {
            "source_extensions": [".kt"]
        }
    }
}

# Common source file extensions
_GENERIC_SOURCE_EXTENSIONS = [
    ".py", ".js", ".jsx", ".ts", ".tsx", ".java", ".go", ".rs", ".rb", ".php",
    ".c", ".cpp", ".cc", ".cxx", ".h", ".hpp", ".cs", ".scala", ".swift", ".kt",
    ".mjs", ".cjs", ".phtml"
]


def _merge_universal_patterns(lang_cfg: dict) -> dict:
    """Merge universal patterns into language config."""
    file_analysis = lang_cfg.setdefault("file_analysis", {})
    file_analysis["common_test_patterns"] = list(set(
        file_analysis.get("common_test_patterns", []) + _COMMON_TEST_PATTERNS
    ))
    file_analysis["config_patterns"] = list(set(
        file_analysis.get("config_patterns", []) + _CONFIG_PATTERNS
    ))
    file_analysis["binary_extensions"] = list(set(
        file_analysis.get("binary_extensions", []) + _BINARY_EXTENSIONS
    ))
    return lang_cfg


def _get_generic_language_config(language_name: str) -> dict:
    """Get generic fallback config for unknown languages."""
    return {
        "name": language_name,
        "file_analysis": {
            "source_extensions": _GENERIC_SOURCE_EXTENSIONS,  # Use generic extensions
            "common_test_patterns": _COMMON_TEST_PATTERNS,
            "config_patterns": _CONFIG_PATTERNS,
            "binary_extensions": _BINARY_EXTENSIONS,
            "test_patterns": []  # No language-specific test patterns
        }
    }


def load_language_config(config_path: Optional[object] = None) -> Dict:
    """
    Returns full config dict with all languages merged with universal patterns.
    """
    # Build full config with merged patterns
    full_config = {}

    for lang_key, lang_cfg in _LANGUAGE_CONFIG.items():
        # Deep copy to avoid mutating original
        lang_cfg_copy = {
            "name": lang_cfg["name"],
            "file_analysis": {
                "source_extensions": lang_cfg["file_analysis"]["source_extensions"].copy()
            }
        }
        full_config[lang_key] = _merge_universal_patterns(lang_cfg_copy)

    return full_config


def get_language_config(language_name: str) -> dict:
    """
    Get language config for a specific language.

    Args:
        language_name: Name of the language (e.g., "Python", "JavaScript")

    Returns:
        Language config dict with merged universal patterns
    """
    if language_name in _LANGUAGE_CONFIG:
        # Deep copy to avoid mutating original
        lang_cfg = {
            "name": _LANGUAGE_CONFIG[language_name]["name"],
            "file_analysis": {
                "source_extensions": _LANGUAGE_CONFIG[language_name]["file_analysis"]["source_extensions"].copy()
            }
        }
        return _merge_universal_patterns(lang_cfg)
    else:
        # Return generic fallback config
        return _get_generic_language_config(language_name)


def count_words(text: str) -> int:
    """Count words in text."""
    if not text:
        return 0
    return len(re.findall(r'\b\w+\b', text))


def is_english(text: str) -> bool:
    """Check if text is likely in English based on ASCII character proportion."""
    if not text or not text.strip():
        return True
    total_chars = len(text)
    ascii_chars = sum(1 for char in text if ord(char) < 128)
    return (ascii_chars / total_chars) >= 0.9


def is_test_file_standalone(language_config: Dict, filename: str) -> bool:
    if not filename:
        return False

    # Normalize to lowercase POSIX-style path
    normalized_path = filename.replace("\\", "/")
    path_lower = normalized_path.lower()
    base = os.path.basename(normalized_path)
    base_lower = base.lower()
    name_no_ext_lower = os.path.splitext(base_lower)[0]
    name_no_ext_orig = os.path.splitext(base)[0]

    # Get patterns from config (always has common_test_patterns due to merge)
    file_analysis = language_config.get("file_analysis", {})
    specific_patterns = file_analysis.get("test_patterns", [])
    common_patterns = file_analysis.get("common_test_patterns", _COMMON_TEST_PATTERNS)
    all_patterns = specific_patterns + common_patterns

    # Check language-specific patterns
    for pattern in all_patterns:
        try:
            if re.search(pattern, normalized_path, flags=re.IGNORECASE):
                return True
        except re.error:
            if pattern.lower() in path_lower:
                return True

    # Directory-based checks (generic, works for all languages)
    dir_regex = re.compile(r"(^|[\\/])(test|tests|spec|specs|__tests__|__test__)([\\/]|$)", flags=re.IGNORECASE)
    if dir_regex.search(path_lower):
        return True

    # Filename-based checks (generic, works for all languages)
    if re.search(r"(\.test\.|\.spec\.|_test\.|_spec\.|\.snap$)", base_lower, flags=re.IGNORECASE):
        return True

    if re.search(r"(_test\.[^./]+|_spec\.[^./]+)$", base_lower, flags=re.IGNORECASE):
        return True

    # Token-based checks (generic, works for all languages)
    if re.search(r"(^|[._-])(test|spec)([._-]|$)", name_no_ext_lower, flags=re.IGNORECASE):
        return True

    # CamelCase suffixes (Java/Kotlin/C#/etc - generic pattern)
    if re.search(r"(Test|Tests|TestCase|Spec|Specs)$", name_no_ext_orig, flags=re.IGNORECASE):
        return True

    return False


def is_asset_file_standalone(language_config: Dict, filename: str) -> bool:
    if not filename:
        return False

    filename_lower = filename.lower()
    file_analysis = language_config.get("file_analysis", {})

    # Binary file extensions
    binary_extensions = file_analysis.get("binary_extensions", [])
    for ext in binary_extensions:
        if filename_lower.endswith(ext):
            return True

    # Config and documentation patterns
    config_patterns = file_analysis.get("config_patterns", [])
    for pattern in config_patterns:
        if filename_lower.endswith(pattern) or pattern in filename_lower:
            return True

    return False


def is_test_file_path(filename: str, language_config_for_repo: dict) -> bool:
    """Check if filename is a test file."""
    if is_test_file_standalone({'language': language_config_for_repo.get('name', '')}, filename):
        return True
    for pattern in language_config_for_repo.get("file_analysis", {}).get("test_patterns", []):
        if pattern in filename:
            return True
    return False


def is_asset_file_path(filename: str, language_config_for_repo: dict) -> bool:
    """Check if filename is an asset file."""
    return is_asset_file_standalone({'language': language_config_for_repo.get('name', '')}, filename)


def get_full_patch_content(repo_full_name: str, base_commit: str, head_commit: str, token: str = None) -> Optional[str]:
    """Fetch full patch content between two commits."""
    import requests

    diff_headers = HEADERS.copy()
    diff_headers["Accept"] = "application/vnd.github.v3.diff"
    if token:
        diff_headers["Authorization"] = f"Bearer {token}"
    try:
        response = requests.get(
            f"https://api.github.com/repos/{repo_full_name}/compare/{base_commit}...{head_commit}",
            headers=diff_headers,
            timeout=30,
        )
        response.raise_for_status()
        return response.text
    except Exception as e:
        print(f"Error getting full patch content: {e}")
        return None


def extract_diff_stats_simple(full_patch: str, language_config: Dict) -> Optional[Dict]:
    """
    Counts source code additions/deletions by parsing the diff.
    """
    if not full_patch:
        return None

    source_code_added = 0
    source_code_deleted = 0

    source_extensions = language_config.get("file_analysis", {}).get("source_extensions", [])

    if not source_extensions:
        source_extensions = _GENERIC_SOURCE_EXTENSIONS

    current_file = None
    in_hunk = False

    for line in full_patch.split('\n'):
        # Detect file start
        if line.startswith('diff --git'):
            current_file = None
            in_hunk = False
            # Extract filename
            parts = line.split()
            if len(parts) >= 3:
                filename = parts[2].replace('b/', '')
                # Check if it's a source file
                is_source = any(filename.endswith(ext) for ext in source_extensions)
                if is_source:
                    # Check it's not a test or asset file
                    if not is_test_file_path(filename, language_config):
                        if not is_asset_file_path(filename, language_config):
                            current_file = filename
        elif line.startswith('@@'):
            in_hunk = True
        elif in_hunk and current_file:
            # Count additions and deletions (excluding comments and blank lines)
            if line.startswith('+') and not line.startswith('+++'):
                content = line[1:].strip()
                # Skip blank lines and common comment patterns
                if content and not content.startswith('//') and not content.startswith('#'):
                    source_code_added += 1
            elif line.startswith('-') and not line.startswith('---'):
                content = line[1:].strip()
                if content and not content.startswith('//') and not content.startswith('#'):
                    source_code_deleted += 1

    return {
        'source_code_added': source_code_added,
        'source_code_deleted': source_code_deleted
    }


def has_sufficient_code_changes(
    repo_full_name: str,
    base_sha: str,
    head_sha: str,
    language_config_for_repo: dict,
    min_code_changes: int,
    full_patch: Optional[str] = None,
    token: Optional[str] = None
) -> Tuple[bool, int]:
    """Check if PR has sufficient code changes."""
    try:
        full_patch = full_patch or get_full_patch_content(repo_full_name, base_sha, head_sha, token)
        if not full_patch:
            return False, 0

        stats = extract_diff_stats_simple(full_patch, language_config_for_repo)
        if not stats:
            return False, 0

        source_code_changes = int(stats.get("source_code_added", 0)) + int(stats.get("source_code_deleted", 0))
        return source_code_changes >= int(min_code_changes), source_code_changes
    except Exception as e:
        return False, 0


def _extract_file_content_from_patch(patch_content: str, filename: str) -> str:
    """Extract file content from patch for a specific file."""
    lines = patch_content.split('\n')
    in_target_file = False
    content_lines = []

    for line in lines:
        if line.startswith('diff --git'):
            in_target_file = line.endswith(f'b/{filename}')
        elif line.startswith('+++') and filename in line:
            in_target_file = True
        if in_target_file and (line.startswith('+') or line.startswith(' ')):
            content_lines.append(line[1:])

    return '\n'.join(content_lines)


def _has_rust_test_content(content: str) -> bool:
    """Check if Rust content contains embedded tests."""
    if not content:
        return False
    content_lower = content.lower()
    rust_test_indicators = ['#[test]', '#[cfg(test)]', 'mod tests', '#[tokio::test']
    return any(indicator in content_lower for indicator in rust_test_indicators)


def has_rust_embedded_tests(pr_files_nodes: list, full_patch: str, language_config_for_repo: dict) -> bool:
    """Check if Rust source files contain embedded tests."""
    rust_source_files = [
        f for f in pr_files_nodes
        if f['path'].endswith('.rs')
        and not is_test_file_path(f['path'], language_config_for_repo)
        and not is_asset_file_path(f['path'], language_config_for_repo)
    ]

    if not rust_source_files:
        return False

    if full_patch:
        for file_info in rust_source_files:
            filename = file_info['path']
            file_content = _extract_file_content_from_patch(full_patch, filename)
            if file_content and _has_rust_test_content(file_content):
                return True

    return False

def normalize_to_utc(dt):
        """Simple UTC normalization fallback."""
        if dt.tzinfo is None:
            return dt.replace(tzinfo=timezone.utc)
        return dt.astimezone(timezone.utc)


# Constants for issue validation
MIN_ISSUE_WORDS = 10
MAX_ISSUE_WORDS = 6000


def extract_issue_number_from_pr_body(pr_body: Optional[str], pr_number: Optional[int] = None) -> Tuple[Optional[str], Optional[str]]:
    """
    Extract a single issue number referenced in a PR body using regex heuristics.

    Returns a tuple: (issue_number, rejection_reason)
      - issue_number: a string of the numeric issue id if exactly one unique reference is found; otherwise None
      - rejection_reason: a short description if rejected (e.g., multiple issues found, no references, no body)

    The extractor prioritizes standard "closing" keywords (close/closes/closed, fix/fixes/fixed,
    resolve/resolves/resolved) with an optional owner/repo prefix, then falls back to any #<number> reference.
    Also handles GitHub URLs like https://github.com/owner/repo/issues/123
    """
    if not pr_body:
        return None, "No PR body content"

    # First try to find issues with closing keywords (optionally with owner/repo prefix)
    # This pattern handles both #number and GitHub URLs
    closing_pattern = r"(?:close|closes|closed|fix|fixes|fixed|resolve|resolves|resolved)\s+(?:[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+\s*)?#(\d+)|(?:close|closes|closed|fix|fixes|fixed|resolve|resolves|resolved)\s*:?\s*https://github\.com/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+/issues/(\d+)"
    matches = re.findall(closing_pattern, pr_body, flags=re.IGNORECASE)

    # Flatten the matches (the pattern returns tuples with two groups, only one will be non-empty)
    issue_numbers = []
    for match in matches:
        if match[0]:  # #number format
            issue_numbers.append(match[0])
        elif match[1]:  # GitHub URL format
            issue_numbers.append(match[1])

    # If no closing keywords found, look for any issue references (both #number and GitHub URLs)
    if not issue_numbers:
        # Look for simple #number references
        simple_matches = re.findall(r"#(\d+)", pr_body)
        issue_numbers.extend(simple_matches)

        # Look for GitHub URLs
        url_matches = re.findall(r"https://github\.com/[a-zA-Z0-9_.-]+/[a-zA-Z0-9_.-]+/issues/(\d+)", pr_body)
        issue_numbers.extend(url_matches)

    unique_issues = set(issue_numbers)
    if len(unique_issues) == 1:
        return unique_issues.pop(), None
    elif len(unique_issues) > 1:
        pr_context = f" for PR #{pr_number}" if pr_number else ""
        sorted_issues = sorted(unique_issues)
        rejection_reason = (
            f"Multiple issues found in PR body: {', '.join(['#' + issue for issue in sorted_issues])}"
        )
        return None, rejection_reason
    else:
        return None, "No issue references found in PR body"


def fetch_issue_details_rest(owner: str, repo_name: str, issue_number: int, github_token: Optional[str] = None) -> Optional[dict]:
    """
    Fetches details for a single issue using the GitHub REST API.
    This serves as a fallback for when a PR body mentions an issue number
    that isn't formally linked in the GraphQL `closingIssuesReferences`.
    The output is formatted to mimic the GraphQL `issue_data` structure.
    """
    import requests

    try:
        headers = HEADERS.copy()
        if github_token:
            headers["Authorization"] = f"Bearer {github_token}"

        response = requests.get(
            f"https://api.github.com/repos/{owner}/{repo_name}/issues/{issue_number}",
            headers=headers,
            timeout=30
        )
        response.raise_for_status()
        issue_details = response.json()

        formatted_issue = {
            "number": issue_details.get("number"),
            "title": issue_details.get("title", ""),
            "body": issue_details.get("body", ""),
            "state": issue_details.get("state", "").upper(),  # Ensure state is uppercase like GraphQL
            "__typename": "Issue"  # Hardcode the type to indicate it's an issue
        }

        # Exclude issues that are actually pull requests
        if "pull_request" in issue_details:
            return None

        return formatted_issue

    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 404:
            pass  # Issue not found, return None
        return None
    except Exception as e:
        return None


def has_valid_issue_word_count(issue_body_text: str) -> bool:
    """
    Checks if the issue body word count is within the specified range (MIN_ISSUE_WORDS and MAX_ISSUE_WORDS).
    """
    if not issue_body_text:
        return False
    word_count = count_words(issue_body_text)
    return MIN_ISSUE_WORDS <= word_count <= MAX_ISSUE_WORDS