from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    KeepTogether,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "CV_Cristobal_Vergara.pdf"
OUTPUT.parent.mkdir(parents=True, exist_ok=True)

FONT_DIR = Path("C:/Windows/Fonts")
pdfmetrics.registerFont(TTFont("Arial", str(FONT_DIR / "arial.ttf")))
pdfmetrics.registerFont(TTFont("Arial-Bold", str(FONT_DIR / "arialbd.ttf")))

NAVY = colors.HexColor("#0F172A")
SLATE = colors.HexColor("#475569")
MUTED = colors.HexColor("#64748B")
BLUE = colors.HexColor("#2563EB")
LINE = colors.HexColor("#D9E2EC")
SOFT = colors.HexColor("#F1F5F9")
TEAL = colors.HexColor("#0F766E")


def style(name, **kwargs):
    base = {
        "fontName": "Arial",
        "fontSize": 9.6,
        "leading": 13.2,
        "textColor": NAVY,
        "spaceAfter": 0,
    }
    base.update(kwargs)
    return ParagraphStyle(name, **base)


styles = {
    "name": style(
        "Name",
        fontName="Arial-Bold",
        fontSize=24,
        leading=27,
        textColor=NAVY,
    ),
    "title": style(
        "Title",
        fontSize=10.1,
        leading=13.7,
        textColor=SLATE,
    ),
    "contact": style(
        "Contact",
        fontSize=8,
        leading=11.3,
        textColor=SLATE,
        alignment=TA_RIGHT,
    ),
    "section": style(
        "Section",
        fontName="Arial-Bold",
        fontSize=9.2,
        leading=12,
        textColor=TEAL,
        spaceBefore=5,
        spaceAfter=4,
    ),
    "body": style("Body"),
    "project_title": style(
        "ProjectTitle",
        fontName="Arial-Bold",
        fontSize=10.1,
        leading=13.1,
        textColor=NAVY,
    ),
    "project_meta": style(
        "ProjectMeta",
        fontSize=7.9,
        leading=10.6,
        textColor=BLUE,
    ),
    "small": style(
        "Small",
        fontSize=8.6,
        leading=11.8,
        textColor=SLATE,
    ),
    "label": style(
        "Label",
        fontName="Arial-Bold",
        fontSize=8.6,
        leading=11.8,
        textColor=NAVY,
    ),
    "footer": style(
        "Footer",
        fontSize=6.8,
        leading=8,
        textColor=MUTED,
        alignment=TA_RIGHT,
    ),
}


def P(text, key="body"):
    return Paragraph(text, styles[key])


def section_heading(text):
    return P(text.upper(), "section")


def project(title, status, body, stack, link=None):
    title_text = title
    if link:
        title_text = f'<a href="{link}" color="#0F172A">{title}</a>'
    header = Table(
        [[P(title_text, "project_title"), P(status, "project_meta")]],
        colWidths=[118 * mm, 55 * mm],
    )
    header.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("ALIGN", (1, 0), (1, 0), "RIGHT"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 1.5 * mm),
            ]
        )
    )
    return KeepTogether(
        [
            header,
            P(body, "body"),
            Spacer(1, 1.2 * mm),
            P(f"<b>Tecnologías:</b> {stack}", "small"),
        ]
    )


def first_page(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(BLUE)
    canvas.setLineWidth(1.4)
    canvas.line(doc.leftMargin, 13.5 * mm, A4[0] - doc.rightMargin, 13.5 * mm)
    canvas.setFont("Arial", 6.8)
    canvas.setFillColor(MUTED)
    canvas.drawRightString(
        A4[0] - doc.rightMargin,
        9.4 * mm,
        "CV profesional | actualizado en agosto de 2026",
    )
    canvas.restoreState()


doc = BaseDocTemplate(
    str(OUTPUT),
    pagesize=A4,
    leftMargin=16 * mm,
    rightMargin=16 * mm,
    topMargin=13 * mm,
    bottomMargin=18 * mm,
    title="CV - Cristóbal Vergara",
    author="Cristóbal Vergara",
    subject="Curriculum profesional",
)

frame = Frame(
    doc.leftMargin,
    doc.bottomMargin,
    doc.width,
    doc.height,
    leftPadding=0,
    rightPadding=0,
    topPadding=0,
    bottomPadding=0,
)
doc.addPageTemplates([PageTemplate(id="CV", frames=[frame], onPage=first_page)])

header_left = [
    P("Cristóbal Vergara", "name"),
    Spacer(1, 1.2 * mm),
    P(
        "Estudiante de Ingeniería en Informática | Desarrollo de software e interés en AI/ML",
        "title",
    ),
]
header_right = P(
    'Santiago, Chile<br/>'
    '<a href="mailto:cvarvergara@gmail.com" color="#2563EB">cvarvergara@gmail.com</a><br/>'
    '<a href="https://nightstrike.cloud" color="#2563EB">nightstrike.cloud</a> | '
    '<a href="https://github.com/xSkyLiN3" color="#2563EB">GitHub</a><br/>'
    '<a href="https://www.linkedin.com/in/cristobal-vergarav/" color="#2563EB">LinkedIn</a>',
    "contact",
)

header = Table(
    [[header_left, header_right]],
    colWidths=[119 * mm, 59 * mm],
)
header.setStyle(
    TableStyle(
        [
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("LEFTPADDING", (0, 0), (-1, -1), 0),
            ("RIGHTPADDING", (0, 0), (-1, -1), 0),
            ("TOPPADDING", (0, 0), (-1, -1), 0),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
        ]
    )
)

story = [header, Spacer(1, 4 * mm)]

rule = Table([[""]], colWidths=[178 * mm], rowHeights=[0.5 * mm])
rule.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), BLUE), ("PADDING", (0, 0), (-1, -1), 0)]))
story.extend([rule, Spacer(1, 4 * mm)])

story.extend(
    [
        section_heading("Perfil"),
        P(
            "Estudiante de Ingeniería en Informática, actualmente en 4.º semestre, con experiencia práctica desarrollando proyectos propios con Python, TypeScript y PostgreSQL. He trabajado con aplicaciones web, control de acceso, despliegue en VPS e integración de IA mediante API. Busco seguir creciendo en ingeniería de software, datos y machine learning con proyección hacia AI/ML Engineering."
        ),
        Spacer(1, 3 * mm),
        section_heading("Proyectos seleccionados"),
        project(
            "Operación Control",
            "PROYECTO PROPIO - PILOTO PRIVADO",
            "Desarrollé un sistema de gestión operativa con Python, Flask y PostgreSQL, incorporando control de acceso por roles, auditoría, exportaciones y soporte de despliegue y recuperación en VPS. La información operativa y los datos no se exponen públicamente.",
            "Python | Flask | PostgreSQL | Docker | Linux | Nginx",
        ),
        Spacer(1, 3 * mm),
        project(
            "PortfolioControl",
            "PROYECTO PROPIO - EN DESARROLLO",
            "Desarrollo una aplicación web y móvil para organizar y analizar información de inversiones. Implementé control de acceso e integración de OpenAI API con respuestas estructuradas y validación. El producto continúa en estabilización y aún no dispone de una demo pública.",
            "TypeScript | Next.js | Expo | PostgreSQL/Supabase | OpenAI API",
        ),
        Spacer(1, 3 * mm),
        project(
            "Weapon Inspector",
            "PROYECTO HISTÓRICO - CÓDIGO PÚBLICO",
            "Desarrollé y documenté un plugin para AMX Mod X orientado a Counter-Strike 1.6, trabajando con eventos, configuración, caché e integración sobre un sistema existente. La versión 1.1.1 incluye compilación reproducible y una release pública.",
            "Pawn | AMX Mod X | GitHub Actions | CI",
            "https://github.com/xSkyLiN3/weapon-inspector-amx",
        ),
        Spacer(1, 3.2 * mm),
        section_heading("Tecnologías"),
    ]
)

skills = Table(
    [
        [
            P("<b>Lenguajes y datos</b><br/>Python | TypeScript | SQL | PostgreSQL", "small"),
            P("<b>Web</b><br/>Flask | Next.js", "small"),
        ],
        [
            P("<b>Infraestructura</b><br/>Docker | Linux | Nginx | VPS", "small"),
            P("<b>IA aplicada</b><br/>OpenAI API | salidas estructuradas | validación", "small"),
        ],
    ],
    colWidths=[89 * mm, 89 * mm],
)
skills.setStyle(
    TableStyle(
        [
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("BACKGROUND", (0, 0), (-1, -1), SOFT),
            ("BOX", (0, 0), (-1, -1), 0.5, LINE),
            ("INNERGRID", (0, 0), (-1, -1), 0.5, LINE),
            ("LEFTPADDING", (0, 0), (-1, -1), 8),
            ("RIGHTPADDING", (0, 0), (-1, -1), 8),
            ("TOPPADDING", (0, 0), (-1, -1), 6),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ]
    )
)
story.extend([skills, Spacer(1, 3.5 * mm), section_heading("Formación, credencial e idiomas")])

bottom = Table(
    [
        [
            P(
                "<b>Ingeniería en Informática</b><br/>Universidad Bernardo O'Higgins<br/>2025 - actualidad | 4.º semestre de 8 | egreso estimado 2028",
                "small",
            ),
            P(
                '<b><a href="https://www.kaggle.com/learn/certification/cristobalvergara03/python" color="#0F172A">Python - Kaggle</a></b><br/>Credencial completada en mayo de 2026<br/><b>Idiomas:</b> Español nativo | Inglés: buena comprensión y comunicación oral básica',
                "small",
            ),
        ]
    ],
    colWidths=[89 * mm, 89 * mm],
)
bottom.setStyle(
    TableStyle(
        [
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("LEFTPADDING", (0, 0), (0, 0), 0),
            ("RIGHTPADDING", (0, 0), (0, 0), 8),
            ("LEFTPADDING", (1, 0), (1, 0), 8),
            ("RIGHTPADDING", (1, 0), (1, 0), 0),
            ("LINEBEFORE", (1, 0), (1, 0), 0.5, LINE),
            ("TOPPADDING", (0, 0), (-1, -1), 0),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
        ]
    )
)
story.append(bottom)

doc.build(story)
print(OUTPUT)
