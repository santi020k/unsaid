export const ui = {
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.skip_to_content': 'Skip to main content',
    'nav.main': 'Site',
    'nav.lang': 'Español',

    'hero.eyebrow': 'Anonymous. Always.',
    'hero.headline': 'The things everyone knows.\nThe things nobody says.',
    'hero.sub': 'No names. No filters. Just truth.',
    'hero.cta': 'Share a truth',

    'feed.title': 'Recent truths',
    'feed.empty': 'No truths yet. Be the first.',
    'feed.load_more': 'Load more',
    'feed.badge_auto_translation': 'Automated translation',
    'feed.badge_auto_translation_title':
      'This text was automatically translated from a post written in another language.',

    'form.title': 'Say it.',
    'form.placeholder': 'Type your truth here…',
    'form.submit': 'Publish anonymously',
    'form.submitting': 'Publishing…',
    'form.chars_left': '{n} characters left',
    'form.success': 'Truth published.',
    'form.error.generic': 'Something went wrong. Try again.',
    'form.error.limit': 'Daily limit reached. Come back tomorrow.',
    'form.error.captcha': 'CAPTCHA failed. Please try again.',
    'form.error.captcha_required': 'Please complete the CAPTCHA before publishing.',
    'form.error.network':
      'Cannot reach the API. If you are developing locally, confirm the API is running (port 8787) and PUBLIC_API_URL is set.',
    'form.error.too_short': 'Too short. Say a bit more.',
    'form.error.too_long': 'Too long. Keep it tight.',

    'about.title': 'What is Unsaid?',
    'about.body': 'A space for the uncomfortable, the obvious, the overlooked. Anonymous by design. No accounts. No tracking.',

    'footer.built_prefix': 'Built by',
    'footer.author': 'Santiago Molina',
    'footer.repo': 'GitHub',
    'footer.repo_aria': 'View the Unsaid source code on GitHub',
    'footer.privacy': 'No data collected. No cookies. No bullshit.'
  },
  es: {
    'nav.home': 'Inicio',
    'nav.about': 'Acerca de',
    'nav.skip_to_content': 'Saltar al contenido principal',
    'nav.main': 'Sitio',
    'nav.lang': 'English',

    'hero.eyebrow': 'Anónimo. Siempre.',
    'hero.headline': 'Las cosas que todos saben.\nLas que nadie dice.',
    'hero.sub': 'Sin nombres. Sin filtros. Solo verdad.',
    'hero.cta': 'Compartir una verdad',

    'feed.title': 'Verdades recientes',
    'feed.empty': 'Sin verdades aún. Sé el primero.',
    'feed.load_more': 'Cargar más',
    'feed.badge_auto_translation': 'Traducción automática',
    'feed.badge_auto_translation_title':
      'Este texto se tradujo automáticamente desde una publicación escrita en otro idioma.',

    'form.title': 'Dilo.',
    'form.placeholder': 'Escribe tu verdad aquí…',
    'form.submit': 'Publicar anónimamente',
    'form.submitting': 'Publicando…',
    'form.chars_left': '{n} caracteres restantes',
    'form.success': 'Verdad publicada.',
    'form.error.generic': 'Algo salió mal. Intenta de nuevo.',
    'form.error.limit': 'Límite diario alcanzado. Vuelve mañana.',
    'form.error.captcha': 'CAPTCHA fallido. Intenta de nuevo.',
    'form.error.captcha_required': 'Completa el CAPTCHA antes de publicar.',
    'form.error.network':
      'No se puede conectar a la API. En desarrollo local, confirma que la API está en marcha (puerto 8787) y que PUBLIC_API_URL es correcta.',
    'form.error.too_short': 'Muy corto. Di un poco más.',
    'form.error.too_long': 'Muy largo. Sé más conciso.',

    'about.title': '¿Qué es Unsaid?',
    'about.body': 'Un espacio para lo incómodo, lo obvio, lo ignorado. Anónimo por diseño. Sin cuentas. Sin rastreo.',

    'footer.built_prefix': 'Creado por',
    'footer.author': 'Santiago Molina',
    'footer.repo': 'GitHub',
    'footer.repo_aria': 'Ver el código fuente de Unsaid en GitHub',
    'footer.privacy': 'Sin datos recopilados. Sin cookies. Sin mentiras.'
  }
} as const

export type UIKey = keyof typeof ui.en
