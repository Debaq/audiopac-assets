# audiopac-assets

Catálogos, packs de pruebas y audio para [AudioPAC](https://github.com/Debaq/audiopac) — evaluación auditiva central (PAC) y logoaudiometría.

La app consume este repo on-demand: bajás packs nuevos sin rebuildearla.

## Estructura

```
index.json                      # manifest raíz: catálogos + packs + versiones + hashes
catalogs/                       # corpus de habla (texto + keywords) referenciados por audio
  sharvard-es-v1.json
packs/                          # definiciones de pruebas (tests + parámetros + referencias)
  pac-patterns-v1.json          # FPT / DPT / PPS / Memoria
  pac-limens-v1.json            # DLF / DLD / DLI
  pac-temporal-v1.json          # Gap / TOJ / FGC
  pac-binaural-v1.json          # ILD / Dicótico NV / Fusión
  pac-noise-v1.json             # GIN / RGD / NBN
  pac-mld-v1.json               # Masking Level Difference
  pps-pinheiro-v1.json          # PPS estándar Pinheiro
  dps-musiek-v1.json            # DPS estándar Musiek
  dichotic-digits-es-v1.json    # DDT adaptación ES
  ssw-es-v1.json                # SSW adaptación ES (beta)
  hint-es-v1.json               # HINT-ES custom
  hint-es-clinico-v1.json       # HINT-ES clínico (Sharvard L01-L70)
  matrix-es-v1.json             # Matrix-ES (Hochmuth) 5-AFC
  sinb-es-v1.json               # Speech in Babble
  sharvard-es-v1.json           # HINT L01 standalone
  logoaud-latam-v1.json         # SRT + discriminación LatAm
  logoaud-us-es-v1.json         # SRT bisílabos hispanos US
  palpa-es-v1.json              # Discriminación fonológica
sources/                        # fuentes originales antes de parsear (reproducibilidad)
scripts/                        # generadores JSON desde fuentes
```

Audio pesado (corpus grabados) se publica como **GitHub Releases** adjuntos, no en el árbol git:

```
releases/
  sharvard-audio-v1 → sharvard-es-f-v1.tar.gz  (voz femenina, ~130 MB)
                      sharvard-es-m-v1.tar.gz  (voz masculina, ~135 MB)
```

## `index.json` — manifest raíz

Dos colecciones top-level: `catalogs` (corpus de habla con audio) y `packs` (definiciones de pruebas).

```jsonc
{
  "schema": 1,
  "updated_at": "2026-04-18T15:21:26Z",
  "catalogs": [ /* corpus tipo Sharvard, ver abajo */ ],
  "packs":    [ /* definiciones de tests PAC / logoaudiometría */ ]
}
```

### Entrada de `catalogs[]`

Corpus de habla con texto + audio descargable separado.

```jsonc
{
  "id": "sharvard-es",
  "name": "Sharvard ES (peninsular)",
  "version": "1.0.0",
  "type": "sentence",                  // sentence | srt | dichotic_digits | matrix
  "language": "es",
  "region": "ES",
  "license": "CC-BY",
  "source": "https://zenodo.org/records/3547446",
  "citation": "Aubanel, García Lecumberri, Cooke (2014) Int J Audiol 53(9):633-641",
  "lists": 70,
  "items": 700,
  "keywords_per_item": 5,
  "text_url": "catalogs/sharvard-es-v1.json",
  "text_sha256": "…",
  "text_bytes": 211165,
  "audio_packs": [
    {
      "voice": "F",
      "label": "Voz femenina",
      "gender": "female",
      "speaker_id": "ES-F-01",
      "description": "…",
      "release_tag": "sharvard-audio-v1",
      "asset_name": "sharvard-es-f-v1.tar.gz",
      "sha256": "…",
      "bytes": 130114985,
      "format": "wav",
      "channels": 1
    }
  ]
}
```

### Entrada de `packs[]`

Definición de prueba (uno o varios `tests` embebidos). El JSON completo se baja desde `url`.

```jsonc
{
  "id": "pac-patterns-v1",
  "version": "1.2.0",
  "name": "Pruebas de Patrones Tonales (FPT / DPT / PPS / Memoria)",
  "category": "pac.patterns",          // ver tabla abajo
  "requirements": "ninguno",           // ninguno | recording | audio_pack
  "license": "CC-BY-SA",
  "url": "packs/pac-patterns-v1.json",
  "sha256": "…",
  "bytes": 23964
}
```

**Categorías**:

| Categoría          | Dominio                                   |
|--------------------|-------------------------------------------|
| `pac.patterns`     | Patrones tonales (FPT, DPT, PPS, memoria) |
| `pac.limens`       | Limens diferenciales (DLF, DLD, DLI)      |
| `pac.temporal`     | Procesamiento temporal (Gap, TOJ, FGC)    |
| `pac.binaural`     | Integración binaural (ILD, dicótico NV)   |
| `pac.noise`        | Pruebas con ruido (GIN, RGD, NBN)         |
| `pac.mld`          | Masking Level Difference                  |
| `pac.dichotic`     | Dicótico verbal (SSW)                     |
| `dichotic`         | Dichotic Digits                           |
| `hint`             | SRT en ruido (HINT, Matrix, SinB)         |
| `logoaudiometry`   | SRT + discriminación de palabra           |

**Requirements**:

- `ninguno` — sintetizable on-the-fly (tonos, ruidos, gaps).
- `recording` — usuario debe grabar estímulos en `/estimulos` antes de correr.
- `audio_pack` — requiere descargar tarball de release vinculado.

## `catalogs/<id>-v<N>.json`

```jsonc
{
  "id": "sharvard-es",
  "version": "1.0.0",
  "lists": [
    {
      "code": "SHARVARD_ES_L01",
      "name": "Sharvard ES Lista 1",
      "items": [
        {
          "pos": 1,
          "token": "Hay gemas de gran valor en la tienda.",
          "keywords": ["hay","gemas","gran","valor","tienda"],
          "audio_id": "shd001"
        }
      ]
    }
  ]
}
```

## `packs/<id>-v<N>.json`

```jsonc
{
  "id": "pac-patterns-v1",
  "version": "1.2.0",
  "name": "…",
  "category": "pac.patterns",
  "description_md": "# Markdown largo con principio, normativos, población…",
  "requirements": "ninguno",
  "license": "CC-BY-SA",
  "author": { "name": "AudioPAC", "url": "https://github.com/Debaq/audiopac" },
  "references": [
    { "citation": "…", "url": "…", "year": 1971, "doi": "10.1121/1.1912589" }
  ],
  "tests": [
    {
      "code": "FPT_STD",
      "name": "FPT (Pinheiro 880/1122)",
      "test_type": "PPS",
      "description": "…",
      "config_json": { /* parámetros propios del motor */ }
    }
  ]
}
```

`test_type` y `config_json` los interpreta el motor correspondiente del front (ver `src/components/<Engine>Run.tsx`).

## Contribuir un pack nuevo (sintetizable)

1. Definí el JSON en `packs/<id>-vN.json` con categoría, refs y `tests[]`.
2. Calculá hash y tamaño:
   ```bash
   sha256sum packs/<id>-vN.json
   wc -c    packs/<id>-vN.json
   ```
3. Agregá entrada a `index.json` → `packs[]`.
4. PR.

## Contribuir un catálogo nuevo (con audio)

1. Fuente original a `sources/<catalog-id>/` (PDF, txt, audios).
2. Script en `scripts/build-<catalog-id>.mjs` que emita `catalogs/<id>-vN.json`.
3. `sha256sum catalogs/<id>-vN.json`.
4. Tarball `<id>-<voice>-vN.tar.gz` con archivos nombrados por `audio_id` (ej. `shd001.wav`).
5. Subí tarball como asset de release con tag `<id>-audio-vN`.
6. Actualizá `index.json` → `catalogs[]` con hashes.
7. PR.

## Licencias

Cada catálogo/pack declara su licencia en `index.json`. Solo se incluyen materiales de libre redistribución. Para corpus cerrados (Matrix-ES audios HörTech, HINT-Spanish HEI) incluimos solo la **estructura** (palabras/frases) — los audios el usuario los graba (`requirements: "recording"`).
