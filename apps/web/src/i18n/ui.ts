export const ui = {
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.skip_to_content': 'Skip to main content',
    'nav.main': 'Site',
    'nav.lang': 'Español',

    'site.description': 'The things everyone knows. The things nobody says.',
    'meta.og_image_alt': 'Unsaid — The things everyone knows. The things nobody says.',

    'hero.eyebrow': 'Anonymous. Always.',
    'hero.headline': 'The things everyone knows.\nThe things nobody says.',
    'hero.sub': 'No names. No filters. Just truth.',
    'hero.cta': 'Share a truth',

    'feed.title': 'Recent truths',
    'feed.empty': 'No truths yet. Be the first.',
    'feed.load_more': 'Load more',
    'feed.loading': 'Loading more…',
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
    'footer.privacy': 'No data collected. No cookies. No bullshit.',
    'footer.legal_nav_aria': 'Legal',
    'footer.legal_privacy': 'Privacy',
    'footer.legal_terms': 'Terms of use',

    'legal.last_updated': 'Last updated: April 26, 2026',
    'legal.privacy_title': 'Privacy policy',
    'legal.privacy_desc':
      'What Unsaid collects and how we use information when you read or post on this site.',
    'legal.terms_title': 'Terms of use',
    'legal.terms_desc': 'How you may use the Unsaid service, and limitations of liability.',

    'privacy.summary_title': 'Summary',
    'privacy.summary_body':
      'Unsaid is built to be anonymous. There are no user accounts, no first-party marketing cookies, and we do not sell your personal information. This page explains what the service and its infrastructure still need to process so the site can work, stay available, and resist abuse.',
    'privacy.content_title': 'Content you see and share',
    'privacy.content_body':
      'Truths you publish and read are stored and displayed for others to see in the app. We keep what is required to run the feed, including the text of each post, its language, identifiers needed for our database, and a timestamp. Posts are public. Do not share secrets or data you are not allowed to make public.',
    'privacy.abuse_title': 'Abuse protection and short-lived technical data',
    'privacy.abuse_body':
      'To limit spam, we use a CAPTCHA (Cloudflare Turnstile) and a daily per-IP posting limit. For the limit, a short-lived key tied to your IP may be written to storage at the network edge, with a maximum retention on the order of a day, so a counter can be enforced. The CAPTCHA check is performed when you post; the token is not stored on our server as part of the post. Traffic may pass through the operator’s network (for example Cloudflare) and can be subject to that provider’s logging and security practices as described in their own policies.',
    'privacy.no_profile_title': 'No sign-in, no analytics profile',
    'privacy.no_profile_body':
      'We do not maintain accounts or a profile of you. We do not use your data for targeted advertising. Your browser and device may still send information that is normal for any website, such as IP address and user-agent; our goal is to use the minimum that service providers and the platform need to deliver and protect the app.',
    'privacy.translation_title': 'Automated translation',
    'privacy.translation_body':
      'If enabled by the operator, Unsaid may generate a translated version of a public post to show it in another language. Translation is derived only from the public post text and may be sent to the configured translation provider.',
    'privacy.choices_title': 'Your choices',
    'privacy.choices_body':
      'You can choose not to use the site, not to post, or to use a browser and network setup that you trust. Do not use Unsaid if the processing described here is not acceptable to you.',
    'privacy.contact_title': 'Contact',
    'privacy.contact_prefix': 'The project is',
    'privacy.contact_github': 'open on GitHub',
    'privacy.contact_middle': '. You can reach the maintainer via the',
    'privacy.contact_author': 'author site',
    'privacy.contact_suffix': 'linked in the footer.',
    'privacy.changes_title': 'Changes',
    'privacy.changes_body':
      'This policy may be updated from time to time. The “Last updated” line at the top of this page will be revised when material changes are made. Your continued use of the site after changes are posted means you understand the new description.',

    'terms.acceptance_title': 'Acceptance',
    'terms.acceptance_body':
      'By using Unsaid (this website and the related API) you agree to these terms. If you do not agree, do not use the service.',
    'terms.service_title': 'The service',
    'terms.service_body':
      'Unsaid provides a way to read and post anonymous, public messages. The service, its availability, and its features can change or end at any time, without prior notice, including for maintenance, cost, or legal reasons.',
    'terms.content_title': 'Your content',
    'terms.content_body':
      'You are responsible for the content you post. It must be lawful in your jurisdiction. You may not use the service to harm others, harass, spread malware, infringe others’ rights, or break applicable law. You grant the operators a non-exclusive, worldwide, royalty-free license to store, process, display, and translate your posts as needed to run the service, including in automated or mirrored form where the software does so. You can stop posting at any time, but what was already public may have been read or cached by others; we are not required to remove past posts from every place the internet has copied them.',
    'terms.disclaimer_title': 'Disclaimer of warranties',
    'terms.disclaimer_prefix': 'The service and the',
    'terms.disclaimer_project': 'open-source project',
    'terms.disclaimer_suffix':
      'on which it may be based are provided “as is” and “as available”, without warranties of any kind, whether express or implied, including implied warranties of merchantability, fitness for a particular purpose, and non-infringement. The maintainers and operators are not required to pre-screen posts, guarantee accuracy, or keep the service free of harmful, offensive, or false material. Use is at your own risk.',
    'terms.liability_title': 'Limitation of liability',
    'terms.liability_body':
      'To the maximum extent allowed by law, the maintainers, contributors, and host(s) of Unsaid are not liable for any indirect, incidental, special, consequential, or punitive damages, or for any loss of profits, data, or goodwill, arising from or related to your use of the service, user content you encounter, or inability to use the service, even if advised of the possibility. Total liability for all claims in connection with the service, where liability cannot be excluded, is limited in aggregate to the amount you paid to use the service, which in the case of the public instance is zero unless a separate written agreement with you says otherwise. Some jurisdictions do not allow certain limitations; in those cases our liability is limited to the fullest extent permitted.',
    'terms.indemnity_title': 'Indemnity',
    'terms.indemnity_body':
      'You agree to defend and hold harmless the maintainers and host(s) from and against any claims, damages, losses, and expenses (including reasonable legal fees) arising from your use of the service, your content, or your violation of these terms, to the extent allowed by law.',
    'terms.license_title': 'Software license',
    'terms.license_prefix': 'The source code for the project, when made available, is under the',
    'terms.license_link': 'MIT License',
    'terms.license_suffix':
      '. How you use a copy you self-host is also governed by that license; these terms of use address use of a running instance of the service, including any deployment not operated by you.',
    'terms.changes_title': 'Changes',
    'terms.changes_body':
      'We may change these terms. The date at the top of this page will be updated. Continued use after changes is acceptance of the updated terms for the public instance. For your own deployment, the usual license and your own policies apply.',
    'terms.contact_title': 'Contact',
    'terms.contact_prefix': 'Technical and community discussion may happen on',
    'terms.contact_github': 'GitHub',
    'terms.contact_suffix': '. The footer links to the author site for other inquiries.'
  },
  es: {
    'nav.home': 'Inicio',
    'nav.about': 'Acerca de',
    'nav.skip_to_content': 'Saltar al contenido principal',
    'nav.main': 'Sitio',
    'nav.lang': 'English',

    'site.description': 'Las cosas que todos saben. Las que nadie dice.',
    'meta.og_image_alt': 'Unsaid — Las cosas que todos saben. Las que nadie dice.',

    'hero.eyebrow': 'Anónimo. Siempre.',
    'hero.headline': 'Las cosas que todos saben.\nLas que nadie dice.',
    'hero.sub': 'Sin nombres. Sin filtros. Solo verdad.',
    'hero.cta': 'Compartir una verdad',

    'feed.title': 'Verdades recientes',
    'feed.empty': 'Sin verdades aún. Sé el primero.',
    'feed.load_more': 'Cargar más',
    'feed.loading': 'Cargando más…',
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
    'footer.privacy': 'Sin datos recopilados. Sin cookies. Sin mentiras.',
    'footer.legal_nav_aria': 'Información legal',
    'footer.legal_privacy': 'Privacidad',
    'footer.legal_terms': 'Términos de uso',

    'legal.last_updated': 'Última actualización: 26 de abril de 2026',
    'legal.privacy_title': 'Política de privacidad',
    'legal.privacy_desc':
      'Qué recopila Unsaid y cómo se usa la información al leer o publicar en este sitio.',
    'legal.terms_title': 'Términos de uso',
    'legal.terms_desc': 'Cómo puedes usar el servicio Unsaid y limitaciones de responsabilidad.',

    'privacy.summary_title': 'Resumen',
    'privacy.summary_body':
      'Unsaid está pensado para ser anónimo. No hay cuentas de usuario, no usamos cookies de marketing propias, y no vendemos tu información personal. Esta página explica qué debe procesar el servicio y su infraestructura para que el sitio funcione, esté disponible y pueda contener abusos.',
    'privacy.content_title': 'Contenido que ves y compartes',
    'privacy.content_body':
      'Las publicaciones se almacenan y se muestran para que otras personas las vean. Conservamos lo necesario para el feed, incluido el texto, el idioma, identificadores requeridos por la base de datos, y la fecha. Las publicaciones son públicas. No compartas secretos ni datos que no puedas publicar abiertamente.',
    'privacy.abuse_title': 'Protección frente al abuso y datos técnicos de breve retención',
    'privacy.abuse_body':
      'Para limitar el spam usamos un CAPTCHA (Cloudflare Turnstile) y un límite diario de publicaciones por dirección IP. Para ese límite puede guardarse de forma breve en el edge una clave vinculada a tu IP, con una retención en el orden de un día, para contar y hacer cumplir el tope. El CAPTCHA se valida al publicar; el token no se guarda en nuestro servidor como parte de la publicación. El tráfico puede transitar por la red del operador (por ejemplo Cloudflare) y estar sujeto a las prácticas de registro y seguridad descritas en la política de dicho proveedor.',
    'privacy.no_profile_title': 'Sin registro, sin perfil analítico',
    'privacy.no_profile_body':
      'No mantenemos cuentas ni un perfil tuyo. No usamos tus datos para publicidad segmentada. Tu explorador y dispositivo aún envían la información que es habitual en cualquier sitio (por ejemplo IP y user-agent); nuestro objetivo es emplear el mínimo que el proveedor y la plataforma requieran para servir y proteger la app.',
    'privacy.translation_title': 'Traducción automática',
    'privacy.translation_body':
      'Si quien opera la instancia la activa, Unsaid puede generar una versión traducida de una publicación pública para mostrarla en otro idioma. La traducción se obtiene solo a partir del texto público y puede enviarse al proveedor de traducción configurado.',
    'privacy.choices_title': 'Tu elección',
    'privacy.choices_body':
      'Puedes dejar de usar el sitio, dejar de publicar, o emplear un explorador y una red de confianza. No utilices Unsaid si el procesamiento descrito no te resulta aceptable.',
    'privacy.contact_title': 'Contacto',
    'privacy.contact_prefix': 'El proyecto está',
    'privacy.contact_github': 'abierto en GitHub',
    'privacy.contact_middle': '. Puedes contactar con quien mantiene el proyecto desde el',
    'privacy.contact_author': 'sitio del autor',
    'privacy.contact_suffix': 'en el pie de página.',
    'privacy.changes_title': 'Cambios',
    'privacy.changes_body':
      'Esta política puede actualizarse. La línea «Última actualización» al inicio refleja cambios relevantes. Si sigues usando el sitio tras la publicación de los cambios, aceptas la descripción actualizada.',

    'terms.acceptance_title': 'Aceptación',
    'terms.acceptance_body':
      'Al usar Unsaid (este sitio y la API asociada) aceptas estos términos. Si no estás de acuerdo, no uses el servicio.',
    'terms.service_title': 'El servicio',
    'terms.service_body':
      'Unsaid ofrece leer y publicar mensajes anónimos y públicos. El servicio, su disponibilidad y sus funciones pueden cambiar o interrumpirse en cualquier momento, con o sin aviso previo, por motivos técnicos, de coste o legales.',
    'terms.content_title': 'Tu contenido',
    'terms.content_body':
      'Eres responsable de lo que publicas. Debe respetar la ley de tu jurisdicción. No utilices el servicio para dañar a terceros, acosar, difundir malware, vulnerar derechos ajenos ni cometer ilícitos. Otorgas a quienes operan el servicio una licencia no exclusiva, mundial y libre de regalías para almacenar, procesar, mostrar y traducir tus publicaciones en la medida necesaria para ofrecer el servicio, incluso con automatización. Puedes dejar de publicar, pero el contenido ya publicado pudo leerse o almacenarse en caché por otras partes; no estamos obligados a borrar el pasado de todos los rastros en internet.',
    'terms.disclaimer_title': 'Exención de garantías',
    'terms.disclaimer_prefix': 'El servicio y el',
    'terms.disclaimer_project': 'código abierto',
    'terms.disclaimer_suffix':
      'en el que se basa, cuando esté publicado, se ofrecen tal cual y según disponibilidad, sin garantía de ningún tipo, expresa o implícita, incluidas comerciabilidad, idoneidad para un fin concreto o no infracción. Quien mantiene u opera el servicio no prefiltra publicaciones, garantiza la veracidad o mantiene un entorno exento de material ofensivo o falso. El uso es bajo tu propio riesgo.',
    'terms.liability_title': 'Limitación de responsabilidad',
    'terms.liability_body':
      'En el máximo alcance que permita la ley, quienes mantienen, aportan y alojan Unsaid no serán responsables de daños indirectos, incidentales, especiales, consecuenciales o punitivos, ni de la pérdida de beneficios, datos o goodwill, que deriven del servicio, del contenido de usuarios o de no poder utilizarlo, aun con conocimiento de dichas posibilidades. La responsabilidad total, cuando no pueda excluirse, queda en conjunto limitada a lo que hayas pagado por el servicio; en la instancia pública, salvo un acuerdo distinto escrito, esa cantidad es cero. Algunas jurisdicciones no permiten limitaciones: en ellas aplicamos la restricción máxima permitida.',
    'terms.indemnity_title': 'Indemnidad',
    'terms.indemnity_body':
      'Aceptas defender y eximir a quienes mantienen y alojan el servicio de reclamaciones, daños, pérdidas y gastos (incluidos honorarios razonables de abogado) vinculados a tu uso, a tu contenido o al incumplimiento de estos términos, en la medida en que la ley lo permita.',
    'terms.license_title': 'Licencia de software',
    'terms.license_prefix': 'El código fuente del proyecto, si se publica, se ofrece bajo la',
    'terms.license_link': 'licencia MIT',
    'terms.license_suffix':
      '. El uso de una copia autohospedada se rige también por esa licencia; estos términos de uso tratan de una instancia en servicio, incluidos despliegues no operados por ti.',
    'terms.changes_title': 'Cambios',
    'terms.changes_body':
      'Estos términos pueden cambiarse. La fecha al inicio de la página se actualizará. El uso continuo de la instancia pública implica aceptar los términos actualizados. En tu propio despliegue aplican la licencia habitual y tus propias condiciones.',
    'terms.contact_title': 'Contacto',
    'terms.contact_prefix': 'La discusión técnica o comunitaria puede desarrollarse en',
    'terms.contact_github': 'GitHub',
    'terms.contact_suffix': '. En el pie encontrarás el enlace al sitio del autor.'
  }
} as const

export type UIKey = keyof typeof ui.en
