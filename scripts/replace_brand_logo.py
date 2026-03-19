from pathlib import Path
import re


ROOT = Path(__file__).resolve().parents[1]
LOGO_AVIF = ROOT / "assets/brand/coreactive-sports-logo.avif"
FAVICON_PNG = ROOT / "assets/brand/coreactive-sports-logo-favicon.png"

OLD_LOGO_NAMES = [
    "BALLINFIT_white_logo_v2--41b0b94b.svg",
    "BALLINFIT_white_logo_v2--ae6ec0e3.svg",
    "BALLINFIT_white_logo_v2--b3dcef5f.svg",
    "BALLINFIT_gym_in_Amsterdam--57c6f7d2.png",
    "BALLINFIT_gym_in_Amsterdam--b3afb423.png",
]

OLD_FAVICON_NAME = "Ballinfit_LOGO_32x32--cb05b0f6.jpg"

LOGO_TOKEN = re.compile(r'[A-Za-z0-9_./-]*coreactive-sports-logo\.avif')
FAVICON_TOKEN = re.compile(r'[A-Za-z0-9_./-]*coreactive-sports-logo-favicon\.png')
SHORTCUT_ICON = re.compile(r'<link rel="shortcut icon" href="[^"]+" type="[^"]+">')


def relative_path(from_file: Path, target: Path) -> str:
    return Path(*([".."] * len(from_file.relative_to(ROOT).parts[:-1])), target.relative_to(ROOT)).as_posix()


def replace_in_file(path: Path) -> bool:
    original = path.read_text(encoding="utf-8", errors="ignore")
    logo_path = relative_path(path, LOGO_AVIF)
    favicon_path = relative_path(path, FAVICON_PNG)

    updated = original

    for old_name in OLD_LOGO_NAMES:
        updated = updated.replace(old_name, logo_path)

    updated = updated.replace(OLD_FAVICON_NAME, favicon_path)
    updated = LOGO_TOKEN.sub(logo_path, updated)
    updated = FAVICON_TOKEN.sub(favicon_path, updated)
    updated = SHORTCUT_ICON.sub(
        f'<link rel="shortcut icon" href="{favicon_path}" type="image/png">',
        updated,
    )

    updated = updated.replace(
        'style="--LOGO-WIDTH: 100px"',
        'style="--LOGO-WIDTH: 124px"',
    )
    updated = updated.replace(
        'width="100" height="87" loading="eager" class="logo__img logo__img--color"',
        'width="124" height="124" loading="eager" class="logo__img logo__img--color" style="object-fit: contain;"',
    )
    updated = updated.replace(
        'width="100" height="100" loading="eager" class="logo__img logo__img--color" style="object-fit: contain;"',
        'width="124" height="124" loading="eager" class="logo__img logo__img--color" style="object-fit: contain;"',
    )
    updated = updated.replace(
        'style="width: 80px;" data-footer-logo=""',
        'style="width: 96px;" data-footer-logo=""',
    )
    updated = updated.replace(
        'width="80" height="80" loading="lazy" sizes="80px"',
        'width="96" height="96" loading="lazy" sizes="96px"',
    )
    updated = updated.replace('alt="BALLINFIT"', 'alt="COREACTIVE SPORTS"')

    if updated == original:
        return False

    path.write_text(updated, encoding="utf-8")
    return True


def main() -> None:
    changed = []
    for html_path in ROOT.rglob("*.html"):
        if replace_in_file(html_path):
            changed.append(html_path.relative_to(ROOT).as_posix())

    print(f"changed={len(changed)}")
    if changed:
        print("\n".join(changed))


if __name__ == "__main__":
    main()
