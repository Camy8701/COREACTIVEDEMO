from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
ACCOUNT_PAGE = ROOT / "account/index.html"
MARKER = 'header__desktop__buttons header__desktop__buttons--icons'


def relative_path(from_file: Path, target: Path) -> str:
    return Path(*([".."] * len(from_file.relative_to(ROOT).parts[:-1])), target.relative_to(ROOT)).as_posix()


def inject_login(path: Path) -> bool:
    original = path.read_text(encoding="utf-8", errors="ignore")
    if MARKER not in original or 'replica-header-login-cell' in original:
      return False

    account_href = relative_path(path, ACCOUNT_PAGE)
    insertion = (
        '<div class="header__desktop__buttons header__desktop__buttons--icons">\n\n'
        '    <div class="header__desktop__button replica-header-login-cell">\n'
        f'      <a href="{account_href}" class="navlink navlink--login-cell">\n'
        '        <span class="navtext">Log In To Account</span>\n'
        '      </a>\n'
        '    </div>'
    )
    updated = original.replace('<div class="header__desktop__buttons header__desktop__buttons--icons">', insertion, 1)

    if updated == original:
        return False

    path.write_text(updated, encoding="utf-8")
    return True


def main() -> None:
    changed = []
    for html_path in ROOT.rglob("*.html"):
        if inject_login(html_path):
            changed.append(html_path.relative_to(ROOT).as_posix())

    print(f"changed={len(changed)}")
    if changed:
        print("\n".join(changed))


if __name__ == "__main__":
    main()
