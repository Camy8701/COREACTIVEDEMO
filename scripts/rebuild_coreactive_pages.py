from pathlib import Path
from textwrap import dedent


ROOT = Path("/Users/kyss/Desktop/ CORE ACTIVE DEMO")


def page_href(slug: str, anchor: str = "") -> str:
    suffix = f"#{anchor}" if anchor else ""
    return f"../{slug}/index.html{suffix}"


def root_href(path: str, anchor: str = "") -> str:
    suffix = f"#{anchor}" if anchor else ""
    return f"../../{path}{suffix}"


def join_page_href(slug: str, anchor: str = "") -> str:
    suffix = f"#{anchor}" if anchor else ""
    return f"../pages/{slug}/index.html{suffix}"


def join_root_href(path: str, anchor: str = "") -> str:
    suffix = f"#{anchor}" if anchor else ""
    return f"../{path}{suffix}"


def page_shell(title: str, depth: int, main_html: str, body_class: str = "ca-page", body_attrs: str = "") -> str:
    prefix = "../" * depth
    return dedent(
        f"""\
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <meta name="theme-color" content="#060606">
            <link rel="shortcut icon" href="{prefix}assets/brand/coreactive-sports-logo-favicon.png" type="image/png">
            <title>{title}</title>
            <link rel="stylesheet" href="{prefix}assets/site.css">
            <script src="{prefix}assets/standalone-shim.js"></script>
            <script defer src="{prefix}assets/site.js"></script>
          </head>
          <body class="{body_class}" {body_attrs}>
            <div data-header-wrapper></div>
            <main class="ca-main">
              {main_html}
            </main>
            <div data-ca-footer></div>
          </body>
        </html>
        """
    )


def hero_image(prefix: str, kicker: str, title: str, lead: str, image: str, primary_href: str, primary_label: str, secondary_href: str = "", secondary_label: str = "", side_html: str = "") -> str:
    secondary = (
        f'<a class="ca-btn ca-btn--ghost" href="{secondary_href}">{secondary_label}</a>' if secondary_href and secondary_label else ""
    )
    return dedent(
        f"""\
        <section class="ca-hero">
          <div class="ca-hero-media">
            <img src="{prefix}assets/media/coreactive/{image}" alt="{title}" loading="eager">
          </div>
          <div class="ca-hero-overlay"></div>
          <div class="ca-hero-inner">
            <div class="ca-hero-grid">
              <div class="ca-hero-copy">
                <span class="ca-kicker">{kicker}</span>
                <h1 class="ca-title">{title}</h1>
                <p class="ca-lead">{lead}</p>
                <div class="ca-actions">
                  <a class="ca-btn ca-btn--primary" href="{primary_href}">{primary_label}</a>
                  {secondary}
                </div>
                <div class="ca-hero-note">
                  <span>7-day introduction</span>
                  <strong>Structured start. Coach-led progression.</strong>
                </div>
              </div>
              {side_html}
            </div>
          </div>
        </section>
        """
    )


def hero_video(prefix: str, kicker: str, title: str, lead: str, video: str, poster: str, primary_href: str, primary_label: str, secondary_href: str = "", secondary_label: str = "", side_html: str = "") -> str:
    secondary = (
        f'<a class="ca-btn ca-btn--ghost" href="{secondary_href}">{secondary_label}</a>' if secondary_href and secondary_label else ""
    )
    return dedent(
        f"""\
        <section class="ca-hero">
          <div class="ca-hero-media">
            <video autoplay muted loop playsinline poster="{prefix}assets/media/coreactive/{poster}">
              <source src="{prefix}assets/media/coreactive/{video}" type="video/mp4">
            </video>
          </div>
          <div class="ca-hero-overlay"></div>
          <div class="ca-hero-inner">
            <div class="ca-hero-grid">
              <div class="ca-hero-copy">
                <span class="ca-kicker">{kicker}</span>
                <h1 class="ca-title">{title}</h1>
                <p class="ca-lead">{lead}</p>
                <div class="ca-actions">
                  <a class="ca-btn ca-btn--primary" href="{primary_href}">{primary_label}</a>
                  {secondary}
                </div>
                <div class="ca-hero-note">
                  <span>7-day introduction</span>
                  <strong>Structured start. Coach-led progression.</strong>
                </div>
              </div>
              {side_html}
            </div>
          </div>
        </section>
        """
    )


def hours_card() -> str:
    return dedent(
        """\
        <aside class="ca-hours-card">
          <span class="ca-panel-label">Opening hours</span>
          <h2>Opening Hours</h2>
          <div class="ca-hours-stack">
            <div class="ca-hours-slot">
              <strong>Mon - Fri</strong>
              <span>7.00AM - 10.00PM</span>
            </div>
            <div class="ca-hours-slot">
              <strong>Sat - Sun</strong>
              <span>9.00AM - 5.00PM</span>
            </div>
          </div>
        </aside>
        """
    )


def write(path: str, content: str) -> None:
    target = ROOT / path
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(content, encoding="utf-8")


def build_classes_page() -> str:
    prefix = "../../"
    main = (
        hero_image(
            prefix,
            "UrbanFit",
            "UrbanFit",
            "Functional, high-energy group training for all ages and levels. Choose the program that matches your pace, your goals, and your season of training.",
            "coreactive-cardio.png",
            page_href("urbanfit-men"),
            "Find your program",
            page_href("schedule"),
            "View schedule",
        )
        + dedent(
            f"""\
            <section class="ca-section" id="programs">
              <div class="ca-section-shell">
                <span class="ca-kicker">Program breakdown</span>
                <h2 class="ca-section-heading">Three clear UrbanFit routes</h2>
                <p class="ca-section-copy">UrbanFit keeps the energy high and the structure clear. Each path is coach-led, group-driven, and designed to help members progress without guesswork.</p>
                <div class="ca-grid ca-grid--3">
                  <article class="ca-panel">
                    <span class="ca-panel-label">UrbanFit Men</span>
                    <h3 class="ca-panel-title">Strength. Conditioning. Performance.</h3>
                    <p class="ca-panel-copy">Built for men who want structured sessions, group energy, and measurable progression.</p>
                    <ul class="ca-panel-list">
                      <li>Coach-led strength and conditioning blocks</li>
                      <li>Group accountability without random programming</li>
                      <li>Direct path into the full weekly schedule</li>
                    </ul>
                    <a class="ca-program-link" href="{page_href("urbanfit-men")}">Explore men</a>
                  </article>
                  <article class="ca-panel">
                    <span class="ca-panel-label">UrbanFit Women</span>
                    <h3 class="ca-panel-title">Strength. Confidence. Fitness.</h3>
                    <p class="ca-panel-copy">High-quality group training that balances progression, support, and real-world results.</p>
                    <ul class="ca-panel-list">
                      <li>Supportive coaching from session one</li>
                      <li>Clear class structure and repeatable progress</li>
                      <li>Designed for consistency, not trend cycles</li>
                    </ul>
                    <a class="ca-program-link" href="{page_href("urbanfit-women")}">Explore women</a>
                  </article>
                  <article class="ca-panel">
                    <span class="ca-panel-label">UrbanFit Kids</span>
                    <h3 class="ca-panel-title">Movement. Coordination. Fun.</h3>
                    <p class="ca-panel-copy">A more playful training lane that builds confidence, movement quality, and engagement.</p>
                    <ul class="ca-panel-list">
                      <li>Coach-led sessions for younger members</li>
                      <li>Movement-first programming with clear structure</li>
                      <li>Positive energy and skill development every week</li>
                    </ul>
                    <a class="ca-program-link" href="{page_href("kids")}">Explore kids</a>
                  </article>
                </div>
              </div>
            </section>
            <section class="ca-section" id="philosophy">
              <div class="ca-section-shell ca-section-shell--soft">
                <span class="ca-kicker">Why UrbanFit</span>
                <h2 class="ca-section-heading">Structured training, not random workouts</h2>
                <div class="ca-grid ca-grid--4">
                  <article class="ca-panel">
                    <h3 class="ca-panel-title">Structured sessions</h3>
                    <p class="ca-panel-copy">Every session is designed for progression, not chaos.</p>
                  </article>
                  <article class="ca-panel">
                    <h3 class="ca-panel-title">Professional coaching</h3>
                    <p class="ca-panel-copy">Coaches guide every step so members always know what to do next.</p>
                  </article>
                  <article class="ca-panel">
                    <h3 class="ca-panel-title">Community driven</h3>
                    <p class="ca-panel-copy">The group environment keeps standards high and momentum strong.</p>
                  </article>
                  <article class="ca-panel">
                    <h3 class="ca-panel-title">Results focused</h3>
                    <p class="ca-panel-copy">Built for real outcomes, not short-lived trends or random intensity spikes.</p>
                  </article>
                </div>
              </div>
            </section>
            <section class="ca-section">
              <div class="ca-section-shell">
                <div class="ca-band">
                  <div class="ca-band-copy">
                    <span class="ca-kicker">Join UrbanFit</span>
                    <h2 class="ca-section-heading">Pick your lane and start training</h2>
                    <p>Go straight into UrbanFit Men, UrbanFit Women, or UrbanFit Kids. The join flow is already local and ready for Supabase, payments, and future multilingual support.</p>
                  </div>
                  <div class="ca-actions">
                    <a class="ca-btn ca-btn--primary" href="{root_href('join/index.html')}">Join now</a>
                    <a class="ca-btn ca-btn--ghost" href="{page_href("schedule")}">See the weekly flow</a>
                  </div>
                </div>
              </div>
            </section>
            <div class="ca-mobile-sticky-cta"><a href="{root_href('join/index.html')}">Join UrbanFit</a></div>
            """
        )
    )
    return page_shell("UrbanFit | CoreActive", 2, main)


def build_program_page(kind: str, title: str, subtitle: str, video: str = "", poster: str = "", image: str = "", benefits=None, for_text=None, expect_text=None, format_items=None, preview=None) -> str:
    prefix = "../../"
    benefits = benefits or []
    for_text = for_text or []
    expect_text = expect_text or []
    format_items = format_items or []
    preview = preview or []
    hero = (
        hero_video(
            prefix,
            kind,
            title,
            subtitle,
            video,
            poster,
            root_href("join/index.html"),
            "Join now",
            page_href("schedule"),
            "Schedule preview",
            hours_card(),
        )
        if video
        else hero_image(
            prefix,
            kind,
            title,
            subtitle,
            image,
            root_href("join/index.html"),
            "Join now",
            page_href("schedule"),
            "Schedule preview",
            hours_card(),
        )
    )
    benefits_html = "".join(f"<li>{item}</li>" for item in benefits)
    for_html = "".join(f"<li>{item}</li>" for item in for_text)
    expect_html = "".join(f"<li>{item}</li>" for item in expect_text)
    format_html = "".join(f"<li>{item}</li>" for item in format_items)
    preview_html = "".join(
        f"""<div class="ca-detail"><strong>{label}</strong><span>{value}</span></div>""" for label, value in preview
    )
    main = (
        hero
        + dedent(
            f"""\
            <section class="ca-section">
              <div class="ca-section-shell">
                <span class="ca-kicker">Who it's for</span>
                <h2 class="ca-section-heading">Built for members who want structure</h2>
                <div class="ca-grid ca-grid--2">
                  <article class="ca-panel">
                    <h3 class="ca-panel-title">Who it's for</h3>
                    <ul class="ca-panel-list">{for_html}</ul>
                  </article>
                  <article class="ca-panel">
                    <h3 class="ca-panel-title">What to expect</h3>
                    <ul class="ca-panel-list">{expect_html}</ul>
                  </article>
                </div>
              </div>
            </section>
            <section class="ca-section">
              <div class="ca-section-shell ca-section-shell--soft">
                <span class="ca-kicker">Benefits</span>
                <h2 class="ca-section-heading">What this program develops</h2>
                <div class="ca-grid ca-grid--3">
                  {''.join(f'<article class="ca-panel"><h3 class="ca-panel-title">{item}</h3><p class="ca-panel-copy">Clear coaching, session-by-session progression, and a group environment that keeps momentum high.</p></article>' for item in benefits)}
                </div>
              </div>
            </section>
            <section class="ca-section">
              <div class="ca-section-shell">
                <span class="ca-kicker">Class format</span>
                <h2 class="ca-section-heading">Simple structure. Strong consistency.</h2>
                <div class="ca-grid ca-grid--3">
                  {''.join(f'<article class="ca-panel"><h3 class="ca-panel-title">{item}</h3><p class="ca-panel-copy">Coach-led and aligned with the week&apos;s training focus.</p></article>' for item in format_items)}
                </div>
                <div class="ca-detail-row">{preview_html}</div>
              </div>
            </section>
            <section class="ca-section">
              <div class="ca-section-shell">
                <div class="ca-band">
                  <div class="ca-band-copy">
                    <span class="ca-kicker">Join section</span>
                    <h2 class="ca-section-heading">Join {title}</h2>
                    <p>Start your training with a local join flow now, then connect payments and member data later without rebuilding the front-end.</p>
                  </div>
                  <div class="ca-actions">
                    <a class="ca-btn ca-btn--primary" href="{root_href('join/index.html')}">Start your training</a>
                    <a class="ca-btn ca-btn--ghost" href="{page_href("schedule")}">View schedule</a>
                  </div>
                </div>
              </div>
            </section>
            <div class="ca-mobile-sticky-cta"><a href="{root_href('join/index.html')}">Join now</a></div>
            """
        )
    )
    return page_shell(f"{title} | CoreActive", 2, main)


def build_about_page() -> str:
    prefix = "../../"
    main = (
        hero_image(
            prefix,
            "About CoreActive",
            "CoreActive is built around structured training, not random workouts.",
            "Performance over trends. Consistency over intensity spikes. Coaching over guessing.",
            "coreactive-cardio.png",
            page_href("classes"),
            "Find your program",
            page_href("schedule"),
            "See the schedule",
        )
        + dedent(
            f"""\
            <section class="ca-section">
              <div class="ca-section-shell">
                <span class="ca-kicker">Philosophy</span>
                <h2 class="ca-section-heading">What drives the brand</h2>
                <div class="ca-grid ca-grid--3">
                  <article class="ca-panel">
                    <h3 class="ca-panel-title">Performance over trends</h3>
                    <p class="ca-panel-copy">Programming is built to help members progress, not chase the latest short-lived format.</p>
                  </article>
                  <article class="ca-panel">
                    <h3 class="ca-panel-title">Consistency over spikes</h3>
                    <p class="ca-panel-copy">Real progress comes from repeatable structure and a system members can sustain.</p>
                  </article>
                  <article class="ca-panel">
                    <h3 class="ca-panel-title">Coaching over guessing</h3>
                    <p class="ca-panel-copy">Members train with context, feedback, and a clearer path forward each week.</p>
                  </article>
                </div>
              </div>
            </section>
            <section class="ca-section">
              <div class="ca-section-shell ca-section-shell--soft">
                <span class="ca-kicker">Brand structure</span>
                <h2 class="ca-section-heading">One umbrella. Two training environments.</h2>
                <div class="ca-grid ca-grid--3">
                  <article class="ca-panel">
                    <h3 class="ca-panel-title">CoreActive</h3>
                    <p class="ca-panel-copy">The umbrella performance fitness brand that connects every member journey.</p>
                  </article>
                  <article class="ca-panel">
                    <h3 class="ca-panel-title">UrbanFit</h3>
                    <p class="ca-panel-copy">Accessible, high-energy group training for men, women, and kids.</p>
                  </article>
                  <article class="ca-panel">
                    <h3 class="ca-panel-title">PulseLab</h3>
                    <p class="ca-panel-copy">A more specialized performance environment for sharper progression.</p>
                  </article>
                </div>
              </div>
            </section>
            <section class="ca-section" id="approach">
              <div class="ca-section-shell">
                <span class="ca-kicker">Training approach</span>
                <h2 class="ca-section-heading">How CoreActive sessions are built</h2>
                <div class="ca-grid ca-grid--3">
                  <article class="ca-panel">
                    <h3 class="ca-panel-title">Progressive overload</h3>
                    <p class="ca-panel-copy">Sessions are designed to build on previous work, not reset every week.</p>
                  </article>
                  <article class="ca-panel">
                    <h3 class="ca-panel-title">Functional fitness</h3>
                    <p class="ca-panel-copy">Training translates into stronger movement patterns and better performance outside the gym.</p>
                  </article>
                  <article class="ca-panel">
                    <h3 class="ca-panel-title">Coaching-led sessions</h3>
                    <p class="ca-panel-copy">Members get structure, feedback, and clearer accountability throughout the week.</p>
                  </article>
                </div>
              </div>
            </section>
            <section class="ca-section">
              <div class="ca-section-shell">
                <div class="ca-band">
                  <div class="ca-band-copy">
                    <span class="ca-kicker">Next step</span>
                    <h2 class="ca-section-heading">Find the CoreActive program that fits</h2>
                    <p>Explore UrbanFit if you want accessible, group-led structure. Explore PulseLab if you want a more precise performance lane.</p>
                  </div>
                  <div class="ca-actions">
                    <a class="ca-btn ca-btn--primary" href="{page_href("classes")}">Find your program</a>
                    <a class="ca-btn ca-btn--ghost" href="{root_href('join/index.html')}">Join now</a>
                  </div>
                </div>
              </div>
            </section>
            """
        )
    )
    return page_shell("About CoreActive", 2, main)


def build_pulselab_page() -> str:
    prefix = "../../"
    main = (
        hero_image(
            prefix,
            "PulseLab",
            "PulseLab",
            "Train with precision. Perform at a higher level.",
            "pulselab-rower.png",
            root_href("join/index.html"),
            "Join PulseLab",
            page_href("schedule"),
            "View schedule",
            hours_card(),
        )
        + dedent(
            f"""\
            <section class="ca-section">
              <div class="ca-section-shell">
                <span class="ca-kicker">Concept</span>
                <h2 class="ca-section-heading">A more specialized training environment</h2>
                <p class="ca-section-copy">PulseLab is more focused, more performance-led, and built for members who want tighter progression, stronger accountability, and clearer measurable outcomes.</p>
              </div>
            </section>
            <section class="ca-section" id="who-its-for">
              <div class="ca-section-shell ca-section-shell--soft">
                <span class="ca-kicker">Who it's for</span>
                <div class="ca-grid ca-grid--3">
                  <article class="ca-panel">
                    <h3 class="ca-panel-title">Serious athletes</h3>
                    <p class="ca-panel-copy">Built for members who want more than casual training volume.</p>
                  </article>
                  <article class="ca-panel">
                    <h3 class="ca-panel-title">Progression focused</h3>
                    <p class="ca-panel-copy">Ideal for members who want to track development and sharpen performance.</p>
                  </article>
                  <article class="ca-panel">
                    <h3 class="ca-panel-title">Performance mindset</h3>
                    <p class="ca-panel-copy">Best for members who respond well to intent, structure, and accountability.</p>
                  </article>
                </div>
              </div>
            </section>
            <section class="ca-section" id="benefits">
              <div class="ca-section-shell">
                <span class="ca-kicker">Training style</span>
                <div class="ca-grid ca-grid--3">
                  <article class="ca-panel">
                    <h3 class="ca-panel-title">Advanced programming</h3>
                    <p class="ca-panel-copy">Sessions are built to stack, test, and refine performance over time.</p>
                  </article>
                  <article class="ca-panel">
                    <h3 class="ca-panel-title">Coaching intensity</h3>
                    <p class="ca-panel-copy">Sharper feedback loops and more demanding session structure.</p>
                  </article>
                  <article class="ca-panel">
                    <h3 class="ca-panel-title">Measurable results</h3>
                    <p class="ca-panel-copy">Faster progress, structured development, and higher accountability.</p>
                  </article>
                </div>
              </div>
            </section>
            <section class="ca-section">
              <div class="ca-section-shell">
                <div class="ca-band">
                  <div class="ca-band-copy">
                    <span class="ca-kicker">Join PulseLab</span>
                    <h2 class="ca-section-heading">Step into the more focused lane</h2>
                    <p>PulseLab is ready as a local front-end now and can be connected to Supabase, Stripe, or Shopify later without changing the UX.</p>
                  </div>
                  <div class="ca-actions">
                    <a class="ca-btn ca-btn--primary" href="{root_href('join/index.html')}">Join PulseLab</a>
                    <a class="ca-btn ca-btn--ghost" href="{page_href("memberships", "pulselab-memberships")}">See plans</a>
                  </div>
                </div>
              </div>
            </section>
            <div class="ca-mobile-sticky-cta"><a href="{root_href('join/index.html')}">Join PulseLab</a></div>
            """
        )
    )
    return page_shell("PulseLab | CoreActive", 2, main)


def build_schedule_page() -> str:
    prefix = "../../"
    main = (
        hero_image(
            prefix,
            "Schedule",
            "Weekly training flow",
            "Use this as the local schedule view for UrbanFit, PulseLab, and member access planning. A membership is still required before class booking goes live.",
            "coreactive-cardio.png",
            root_href("join/index.html"),
            "Join now",
            page_href("memberships"),
            "View plans",
            hours_card(),
        )
        + dedent(
            f"""\
            <section class="ca-section">
              <div class="ca-section-shell ca-section-shell--soft">
                <span class="ca-kicker">Weekly schedule</span>
                <h2 class="ca-section-heading">Current local training board</h2>
                <p class="ca-section-copy">This schedule is stored locally for the standalone build. Update the time blocks later without changing the page structure.</p>
                <div class="ca-schedule-board">
                  <article class="ca-schedule-column">
                    <h3>UrbanFit Men</h3>
                    <div class="ca-schedule-slot"><strong>Monday</strong><span>18:30 Strength + Conditioning</span></div>
                    <div class="ca-schedule-slot"><strong>Wednesday</strong><span>19:00 Performance block</span></div>
                    <div class="ca-schedule-slot"><strong>Saturday</strong><span>10:00 Weekend session</span></div>
                  </article>
                  <article class="ca-schedule-column">
                    <h3>UrbanFit Women</h3>
                    <div class="ca-schedule-slot"><strong>Tuesday</strong><span>18:30 Strength + Fitness</span></div>
                    <div class="ca-schedule-slot"><strong>Thursday</strong><span>19:00 Conditioning focus</span></div>
                    <div class="ca-schedule-slot"><strong>Saturday</strong><span>09:00 Community session</span></div>
                  </article>
                  <article class="ca-schedule-column">
                    <h3>UrbanFit Kids</h3>
                    <div class="ca-schedule-slot"><strong>Wednesday</strong><span>17:00 Movement + coordination</span></div>
                    <div class="ca-schedule-slot"><strong>Saturday</strong><span>11:30 Team skills</span></div>
                    <div class="ca-schedule-slot"><strong>Sunday</strong><span>Optional family session</span></div>
                  </article>
                  <article class="ca-schedule-column">
                    <h3>PulseLab</h3>
                    <div class="ca-schedule-slot"><strong>Tuesday</strong><span>06:30 Precision conditioning</span></div>
                    <div class="ca-schedule-slot"><strong>Thursday</strong><span>18:30 Performance lab</span></div>
                    <div class="ca-schedule-slot"><strong>Sunday</strong><span>08:30 Results session</span></div>
                  </article>
                </div>
              </div>
            </section>
            <section class="ca-section">
              <div class="ca-section-shell">
                <div class="ca-band">
                  <div class="ca-band-copy">
                    <span class="ca-kicker">Before you book</span>
                    <h2 class="ca-section-heading">Membership first, then class access</h2>
                    <p>Keep the front-end flow simple: join first, connect Supabase later, and add real booking logic when the backend is ready.</p>
                  </div>
                  <div class="ca-actions">
                    <a class="ca-btn ca-btn--primary" href="{root_href('join/index.html')}">Start training</a>
                    <a class="ca-btn ca-btn--ghost" href="{page_href("memberships")}">Memberships</a>
                  </div>
                </div>
              </div>
            </section>
            <div class="ca-mobile-sticky-cta"><a href="{root_href('join/index.html')}">Join now</a></div>
            """
        )
    )
    return page_shell("Schedule | CoreActive", 2, main)


def build_memberships_page() -> str:
    prefix = "../../"
    main = (
        hero_image(
            prefix,
            "Memberships",
            "Join CoreActive",
            "Clear access routes for UrbanFit, PulseLab, and flexible credits. Keep the join flow local now and connect payments later.",
            "woman-poster.jpg",
            root_href("join/index.html"),
            "Join now",
            page_href("schedule"),
            "View schedule",
        )
        + dedent(
            f"""\
            <section class="ca-section" id="plans">
              <div class="ca-section-shell">
                <span class="ca-kicker">Plans available</span>
                <h2 class="ca-section-heading">CoreActive membership options</h2>
                <div class="ca-grid ca-grid--3">
                  <article class="ca-panel" id="urbanfit-memberships">
                    <span class="ca-panel-label">UrbanFit Memberships</span>
                    <h3 class="ca-panel-title">Coach-led group access</h3>
                    <p class="ca-panel-copy">Built for members who want high-energy sessions, clear coaching, and a weekly group routine.</p>
                    <ul class="ca-panel-list">
                      <li>UrbanFit Men, Women, and Kids routes</li>
                      <li>Structured class access</li>
                      <li>Best fit for consistent weekly training</li>
                    </ul>
                  </article>
                  <article class="ca-panel" id="pulselab-memberships">
                    <span class="ca-panel-label">PulseLab Memberships</span>
                    <h3 class="ca-panel-title">Performance-focused access</h3>
                    <p class="ca-panel-copy">For members who want a more specialized environment and sharper progression.</p>
                    <ul class="ca-panel-list">
                      <li>More precise programming</li>
                      <li>Higher accountability</li>
                      <li>Clearer performance development</li>
                    </ul>
                  </article>
                  <article class="ca-panel" id="credits">
                    <span class="ca-panel-label">Credits</span>
                    <h3 class="ca-panel-title">Flexible entry point</h3>
                    <p class="ca-panel-copy">Short-term access for members who need more flexibility before settling into a routine.</p>
                    <ul class="ca-panel-list">
                      <li>Ideal for a trial phase</li>
                      <li>Good for limited weekly availability</li>
                      <li>Simple local fixture for the standalone site</li>
                    </ul>
                  </article>
                </div>
              </div>
            </section>
            <section class="ca-section" id="how-it-works">
              <div class="ca-section-shell ca-section-shell--soft">
                <span class="ca-kicker">How membership works</span>
                <div class="ca-detail-row">
                  <div class="ca-detail"><strong>1. Choose your path</strong><span>Pick UrbanFit, PulseLab, or flexible credits based on your current goal.</span></div>
                  <div class="ca-detail"><strong>2. Start the join flow</strong><span>Use the local sign-up page now and plug in Supabase or payments later.</span></div>
                  <div class="ca-detail"><strong>3. Train with structure</strong><span>Move into the schedule and class flow that fits your program.</span></div>
                </div>
              </div>
            </section>
            <section class="ca-section">
              <div class="ca-section-shell">
                <div class="ca-band">
                  <div class="ca-band-copy">
                    <span class="ca-kicker">Conversion block</span>
                    <h2 class="ca-section-heading">Start with a 7-day introduction</h2>
                    <p>Keep the current UX lean: short sections, large actions, and a direct local route into joining.</p>
                  </div>
                  <div class="ca-actions">
                    <a class="ca-btn ca-btn--primary" href="{root_href('join/index.html')}">Join CoreActive</a>
                    <a class="ca-btn ca-btn--ghost" href="{page_href("schedule")}">See class times</a>
                  </div>
                </div>
              </div>
            </section>
            <div class="ca-mobile-sticky-cta"><a href="{root_href('join/index.html')}">Join CoreActive</a></div>
            """
        )
    )
    return page_shell("Memberships | CoreActive", 2, main)


def build_contact_page() -> str:
    prefix = "../../"
    main = (
        hero_image(
            prefix,
            "Contact",
            "Talk to the CoreActive team",
            "Use the local contact flow now and wire up WhatsApp, email routing, or Supabase submissions later without changing the front-end.",
            "coreactive-cardio.png",
            root_href("join/index.html"),
            "Join now",
            page_href("schedule"),
            "View schedule",
        )
        + dedent(
            f"""\
            <section class="ca-section">
              <div class="ca-section-shell ca-section-shell--soft">
                <div class="ca-access-grid">
                  <div class="ca-panel">
                    <span class="ca-panel-label">Support options</span>
                    <h2 class="ca-panel-title">Reach us your way</h2>
                    <ul class="ca-panel-list">
                      <li>Ask about UrbanFit, PulseLab, memberships, or the weekly schedule.</li>
                      <li>Use this local page as the front-end shell for WhatsApp and form routing later.</li>
                      <li>Training access and onboarding details can be shared after sign-up.</li>
                    </ul>
                    <div class="ca-actions">
                      <a class="ca-btn ca-btn--primary" href="{root_href('join/index.html')}">Start training</a>
                      <a class="ca-btn ca-btn--ghost" href="{page_href("memberships")}">Memberships</a>
                    </div>
                  </div>
                  <div class="ca-form-shell">
                    <span class="ca-panel-label">Contact form</span>
                    <form class="ca-form" data-local-form="true">
                      <div class="ca-form-grid">
                        <div class="ca-field">
                          <label for="contact-name">Name</label>
                          <input id="contact-name" name="name" type="text" placeholder="Your name" required>
                        </div>
                        <div class="ca-field">
                          <label for="contact-email">Email</label>
                          <input id="contact-email" name="email" type="email" placeholder="you@coreactive.co.uk" required>
                        </div>
                      </div>
                      <div class="ca-field">
                        <label for="contact-topic">Topic</label>
                        <select id="contact-topic" name="topic" required>
                          <option value="">Choose a topic</option>
                          <option>UrbanFit</option>
                          <option>PulseLab</option>
                          <option>Memberships</option>
                          <option>Schedule</option>
                        </select>
                      </div>
                      <div class="ca-field">
                        <label for="contact-message">Message</label>
                        <textarea id="contact-message" name="message" placeholder="Tell us what you need"></textarea>
                      </div>
                      <button class="ca-btn ca-btn--primary" type="submit">Send message</button>
                    </form>
                  </div>
                </div>
              </div>
            </section>
            """
        )
    )
    return page_shell("Contact | CoreActive", 2, main)


def build_join_page() -> str:
    prefix = "../"
    main = (
        hero_image(
            prefix,
            "Join CoreActive",
            "Build your access and start training.",
            "Use the local sign-up flow now, then connect Supabase authentication and payments later without changing the design.",
            "coreactive-cardio.png",
            join_page_href("memberships"),
            "View plans",
            join_page_href("schedule"),
            "View schedule",
            hours_card(),
        )
        + dedent(
            f"""\
            <section class="ca-section">
              <div class="ca-section-shell ca-section-shell--soft">
                <div class="ca-access-grid" data-auth-page>
                  <div class="ca-panel">
                    <span class="ca-panel-label">Membership start</span>
                    <h2 class="ca-panel-title">Same tone as the schedule page, ready for Supabase later.</h2>
                    <p class="ca-panel-copy">Keep the current front-end clean and local today. Add real authentication, member profiles, and gated access later without redesigning the entry flow.</p>
                    <ul class="ca-panel-list">
                      <li>Structured sign-up flow for UrbanFit, PulseLab, and credits</li>
                      <li>Reusable UI for future multilingual support</li>
                      <li>Fast local shell for onboarding, payments, and CRM later</li>
                    </ul>
                  </div>
                  <div class="ca-form-shell">
                    <span class="ca-panel-label">Sign up</span>
                    <div class="ca-tab-row" role="tablist" aria-label="Authentication mode">
                      <button type="button" data-auth-tab="login">Sign In</button>
                      <button type="button" class="is-active" data-auth-tab="signup">Sign Up</button>
                    </div>
                    <form class="ca-form" data-auth-form="login" data-auth-panel="login" hidden>
                      <div class="ca-field">
                        <label for="join-login-email">Email</label>
                        <input id="join-login-email" name="email" type="email" placeholder="you@coreactive.co.uk" required>
                      </div>
                      <div class="ca-field">
                        <label for="join-login-password">Password</label>
                        <input id="join-login-password" name="password" type="password" placeholder="Enter your password" required>
                      </div>
                      <label class="ca-check">
                        <input name="remember_me" type="checkbox" value="yes">
                        <span>Remember this device</span>
                      </label>
                      <button class="ca-btn ca-btn--primary" type="submit">Sign In</button>
                      <div class="replica-auth-status" data-auth-status aria-live="polite"></div>
                      <div class="ca-inline-links">
                        <a href="{join_root_href('account/index.html')}">Go to login page</a>
                        <a href="{join_page_href("contact")}">Contact support</a>
                      </div>
                    </form>
                    <form class="ca-form" data-auth-form="signup" data-auth-panel="signup">
                      <div class="ca-form-grid">
                        <div class="ca-field">
                          <label for="join-name">Full name</label>
                          <input id="join-name" name="full_name" type="text" placeholder="Your name" required>
                        </div>
                        <div class="ca-field">
                          <label for="join-goal">First focus</label>
                          <select id="join-goal" name="goal" required>
                            <option value="">Choose a focus</option>
                            <option>UrbanFit Men</option>
                            <option>UrbanFit Women</option>
                            <option>UrbanFit Kids</option>
                            <option>PulseLab</option>
                          </select>
                        </div>
                      </div>
                      <div class="ca-field">
                        <label for="join-email">Email</label>
                        <input id="join-email" name="email" type="email" placeholder="you@coreactive.co.uk" required>
                      </div>
                      <div class="ca-form-grid">
                        <div class="ca-field">
                          <label for="join-password">Password</label>
                          <input id="join-password" name="password" type="password" placeholder="Create password" required>
                        </div>
                        <div class="ca-field">
                          <label for="join-confirm-password">Confirm password</label>
                          <input id="join-confirm-password" name="confirm_password" type="password" placeholder="Repeat password" required>
                        </div>
                      </div>
                      <label class="ca-check">
                        <input name="updates" type="checkbox" value="yes">
                        <span>Keep me updated on new sessions, memberships, and launches.</span>
                      </label>
                      <label class="ca-check">
                        <input name="consent" type="checkbox" value="yes" required>
                        <span>I&apos;m ready to connect this flow to Supabase later.</span>
                      </label>
                      <button class="ca-btn ca-btn--primary" type="submit">Create account shell</button>
                      <div class="replica-auth-status" data-auth-status aria-live="polite"></div>
                      <div class="ca-aux-links">
                        <a href="{join_page_href("memberships")}">View plans first</a>
                        <a href="{join_page_href("schedule")}">Check schedule</a>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </section>
            <div class="ca-mobile-sticky-cta"><a href="{join_page_href("memberships")}">View plans</a></div>
            """
        )
    )
    return page_shell("Join CoreActive", 1, main, body_attrs='data-auth-default="signup"')


def build_faq_page() -> str:
    prefix = "../../"
    main = (
        hero_image(
            prefix,
            "FAQ",
            "CoreActive FAQ",
            "Quick answers on memberships, program choice, kids sessions, and how to get started.",
            "coreactive-cardio.png",
            root_href("join/index.html"),
            "Join now",
            page_href("contact"),
            "Contact support",
        )
        + dedent(
            f"""\
            <section class="ca-section">
              <div class="ca-section-shell ca-section-shell--soft">
                <span class="ca-kicker">Common questions</span>
                <h2 class="ca-section-heading">Start with the right route</h2>
                <div class="ca-grid ca-grid--2">
                  <article class="ca-panel">
                    <h3 class="ca-panel-title">Which program should I start with?</h3>
                    <p class="ca-panel-copy">UrbanFit is the best starting point for coach-led group energy. PulseLab is the more specialized option for members chasing tighter progression and performance.</p>
                  </article>
                  <article class="ca-panel">
                    <h3 class="ca-panel-title">Do I need a membership first?</h3>
                    <p class="ca-panel-copy">Yes. Keep the flow simple for now: choose a membership, start the local join shell, and connect booking logic later once the backend is ready.</p>
                  </article>
                  <article class="ca-panel">
                    <h3 class="ca-panel-title">Is there a kids option?</h3>
                    <p class="ca-panel-copy">Yes. UrbanFit Kids focuses on movement, coordination, and fun in a structured coach-led environment.</p>
                  </article>
                  <article class="ca-panel">
                    <h3 class="ca-panel-title">What does the 7-day intro mean?</h3>
                    <p class="ca-panel-copy">It is the updated front-end replacement for the old free trial messaging and gives you a lighter way into the CoreActive training system.</p>
                  </article>
                </div>
              </div>
            </section>
            <section class="ca-section">
              <div class="ca-section-shell">
                <div class="ca-band">
                  <div class="ca-band-copy">
                    <span class="ca-kicker">Still unsure?</span>
                    <h2 class="ca-section-heading">Talk to the team or view the schedule</h2>
                    <p>Use the current local front-end to choose a route now. WhatsApp, Supabase, and booking logic can all be connected later without changing the page system.</p>
                  </div>
                  <div class="ca-actions">
                    <a class="ca-btn ca-btn--primary" href="{root_href('join/index.html')}">Join now</a>
                    <a class="ca-btn ca-btn--ghost" href="{page_href("schedule")}">View schedule</a>
                  </div>
                </div>
              </div>
            </section>
            """
        )
    )
    return page_shell("FAQ | CoreActive", 2, main)


def build_shop_page() -> str:
    prefix = "../../"
    product_href = root_href("products/coreactive-resistance-band-set/index.html")
    main = (
        hero_image(
            prefix,
            "Shop",
            "CoreActive Shop",
            "Restore the local shop with gym-ready essentials that match the training identity of the site.",
            "resistance-band-set.svg",
            product_href,
            "Shop now",
            root_href("pages/schedule/index.html"),
            "View schedule",
        )
        + dedent(
            f"""\
            <section class="ca-section">
              <div class="ca-section-shell">
                <span class="ca-kicker">Featured product</span>
                <h2 class="ca-section-heading">Training gear built for warm-ups, activation, and travel sessions</h2>
                <div class="ca-shop-grid">
                  <article class="ca-shop-card">
                    <a class="ca-shop-media" href="{product_href}">
                      <img src="{prefix}assets/media/coreactive/resistance-band-set.svg" alt="CoreActive Resistance Band Set" loading="lazy">
                    </a>
                    <div class="ca-shop-copy">
                      <span class="ca-panel-label">Portable training</span>
                      <h3>CoreActive Resistance Band Set</h3>
                      <p>A lightweight training kit for activation, strength prep, recovery days, and hotel-room sessions.</p>
                      <span class="ca-price-tag">€ 29,00</span>
                      <div class="ca-actions">
                        <a class="ca-btn ca-btn--primary" href="{product_href}">View product</a>
                        <a class="ca-btn ca-btn--ghost" href="{root_href('join/index.html')}">Join CoreActive</a>
                      </div>
                    </div>
                  </article>
                  <article class="ca-shop-card">
                    <div class="ca-shop-copy">
                      <span class="ca-panel-label">Why this item</span>
                      <h3>Simple, local, deployable</h3>
                      <p>The old apparel product has been replaced with a gym-related product that fits the CoreActive brand and works with the existing local cart stub.</p>
                      <ul class="ca-panel-list">
                        <li>Easy to use before strength or conditioning sessions</li>
                        <li>Compact enough for gym bags and travel</li>
                        <li>Local product route with local cart flow</li>
                      </ul>
                    </div>
                  </article>
                </div>
              </div>
            </section>
            <div class="ca-mobile-sticky-cta"><a href="{product_href}">Shop now</a></div>
            """
        )
    )
    return page_shell("Shop | CoreActive", 2, main)


def build_product_page() -> str:
    prefix = "../../"
    main = (
        hero_image(
            prefix,
            "Gym Essentials",
            "Resistance Band Set",
            "A portable training kit for warm-ups, activation, mobility work, and light resistance sessions.",
            "resistance-band-set.svg",
            "#buy-now",
            "Add to cart",
            root_href("collections/frontpage/index.html"),
            "Back to shop",
        )
        + dedent(
            f"""\
            <section class="ca-section" id="buy-now">
              <div class="ca-section-shell">
                <span class="ca-kicker">Product details</span>
                <h2 class="ca-section-heading">CoreActive Resistance Band Set</h2>
                <div class="ca-product-layout">
                  <div class="ca-product-gallery">
                    <img src="{prefix}assets/media/coreactive/resistance-band-set.svg" alt="CoreActive Resistance Band Set" loading="lazy">
                  </div>
                  <div class="ca-product-summary">
                    <span class="ca-panel-label">Gym product</span>
                    <h3 class="ca-panel-title">Portable strength and activation kit</h3>
                    <p class="ca-price-tag">€ 29,00</p>
                    <p class="ca-panel-copy">Use it for activation before lifting, movement prep before classes, home workouts, or light recovery circuits when you are away from the gym.</p>
                    <ul class="ca-panel-list">
                      <li>Includes multiple resistance levels for warm-up and accessory work</li>
                      <li>Good for glutes, shoulders, mobility prep, and travel sessions</li>
                      <li>Works with the local standalone cart and checkout stub</li>
                    </ul>
                    <form class="ca-form ca-product-form" action="../../cart/" data-local-form="true">
                      <input type="hidden" name="quantity" value="1">
                      <div class="ca-actions">
                        <button class="ca-btn ca-btn--primary" type="submit" name="add" value="1">Add to demo cart</button>
                        <a class="ca-btn ca-btn--ghost" href="{root_href('collections/frontpage/index.html')}">Back to shop</a>
                      </div>
                    </form>
                    <p class="ca-product-note">Local standalone commerce stub: the front-end product and cart flow work now, and a real checkout can be connected later.</p>
                  </div>
                </div>
              </div>
            </section>
            <section class="ca-section">
              <div class="ca-section-shell">
                <div class="ca-grid ca-grid--3">
                  <article class="ca-panel">
                    <h3 class="ca-panel-title">Warm-up ready</h3>
                    <p class="ca-panel-copy">Ideal before UrbanFit classes, leg sessions, and upper-body activation blocks.</p>
                  </article>
                  <article class="ca-panel">
                    <h3 class="ca-panel-title">Travel friendly</h3>
                    <p class="ca-panel-copy">Fits easily into a gym bag so members can keep moving outside the main facility.</p>
                  </article>
                  <article class="ca-panel">
                    <h3 class="ca-panel-title">Gym relevant</h3>
                    <p class="ca-panel-copy">Replaces the removed apparel product with a more relevant training-focused item.</p>
                  </article>
                </div>
              </div>
            </section>
            <div class="ca-mobile-sticky-cta"><a href="#buy-now">Add to cart</a></div>
            """
        )
    )
    return page_shell("CoreActive Resistance Band Set", 2, main)


def main() -> None:
    write("pages/classes/index.html", build_classes_page())
    men = build_program_page(
        "UrbanFit Men",
        "UrbanFit Men",
        "Strength. Conditioning. Performance.",
        video="man.mp4",
        poster="man-poster.jpg",
        benefits=["Strength", "Conditioning", "Performance"],
        for_text=[
            "Beginners to intermediate members who want a clear plan",
            "People who want structure instead of random workouts",
            "Members who thrive on strong group training energy",
        ],
        expect_text=[
            "Coach-led group sessions every week",
            "Structured workouts with clear intent",
            "Support, accountability, and progression",
        ],
        format_items=["Warm-up", "Main workout", "Finisher"],
        preview=[
            ("Monday", "18:30 Strength + Conditioning"),
            ("Wednesday", "19:00 Performance block"),
            ("Saturday", "10:00 Weekend session"),
        ],
    )
    write("pages/urbanfit-men/index.html", men)
    write("pages/personal-training/index.html", men)
    women = build_program_page(
        "UrbanFit Women",
        "UrbanFit Women",
        "Strength. Confidence. Fitness.",
        video="woman.mp4",
        poster="woman-poster.jpg",
        benefits=["Strength", "Confidence", "Fitness"],
        for_text=[
            "Beginners to intermediate members who want consistency",
            "Women looking for structure and group energy",
            "Anyone ready for coach-led progression without guesswork",
        ],
        expect_text=[
            "High-energy group sessions with coaching support",
            "Structured workouts designed for progression",
            "A training environment built around consistency",
        ],
        format_items=["Warm-up", "Main workout", "Finisher"],
        preview=[
            ("Tuesday", "18:30 Strength + Fitness"),
            ("Thursday", "19:00 Conditioning focus"),
            ("Saturday", "09:00 Community session"),
        ],
    )
    write("pages/urbanfit-women/index.html", women)
    write(
        "pages/kids/index.html",
        build_program_page(
            "UrbanFit Kids",
            "UrbanFit Kids",
            "Movement. Coordination. Fun.",
            image="urbanfit-kids.png",
            benefits=["Coordination", "Movement", "Fun"],
            for_text=[
                "Kids who benefit from movement-first, coach-led sessions",
                "Families looking for a fun and structured weekly routine",
                "Young members who need confidence and engagement",
            ],
            expect_text=[
                "Coach-led sessions with age-appropriate structure",
                "Movement drills, coordination games, and team energy",
                "A positive environment that keeps sessions fun",
            ],
            format_items=["Play warm-up", "Skill circuit", "Team finisher"],
            preview=[
                ("Wednesday", "17:00 Movement + coordination"),
                ("Saturday", "11:30 Team skills"),
                ("Sunday", "Optional family session"),
            ],
        ),
    )
    about = build_about_page()
    write("pages/community/index.html", about)
    write("pages/about/index.html", about)
    write("pages/meet-the-trainers/index.html", about)
    pulselab = build_pulselab_page()
    write("pages/hyrox/index.html", pulselab)
    write("pages/pulselab/index.html", pulselab)
    memberships = build_memberships_page()
    write("pages/memberships/index.html", memberships)
    write("pages/memberships-v2/index.html", memberships)
    write("pages/ballin-fitness-memberships/index.html", memberships)
    write("pages/group-class-memberships/index.html", memberships)
    write("pages/get-credits/index.html", memberships)
    write("pages/free-trial/index.html", memberships)
    write("pages/promo/index.html", memberships)
    write("pages/schedule/index.html", build_schedule_page())
    write("pages/contact/index.html", build_contact_page())
    write("pages/faq/index.html", build_faq_page())
    write("pages/rookie/index.html", build_classes_page())
    shop = build_shop_page()
    write("collections/frontpage/index.html", shop)
    product = build_product_page()
    write("products/coreactive-resistance-band-set/index.html", product)
    write("products/ballinfit-camo-running-set/index.html", product)
    write("join/index.html", build_join_page())


if __name__ == "__main__":
    main()
