# audiopac-assets

Catálogos y packs de audio para [AudioPAC](https://github.com/Debaq/audiopac) — evaluación auditiva central y logoaudiometría.

La app consume este repo on-demand: bajás catálogos nuevos sin rebuildearla.

## Estructura

```
index.json                      # manifest raíz: lista de catálogos + versiones + hashes
catalogs/
  sharvard-es-v1.json           # texto + keywords (700 frases)
  ...
sources/                        # fuentes originales antes de parsear (para reproducibilidad)
scripts/                        # generadores JSON desde fuentes
```

Packs de audio (pesados) se publican como **GitHub Releases** adjuntos, no en el árbol git:

```
releases/
  sharvard-audio-v1 → sharvard-es-f-v1.tar.gz  (voz femenina, 265 MB)
                      sharvard-es-m-v1.tar.gz  (voz masculina, 265 MB)
```

## Formato `index.json`

```jsonc
{
  "schema": 1,
  "updated_at": "2026-04-17",
  "catalogs": [
    {
      "id": "sharvard-es",
      "name": "Sharvard ES (peninsular)",
      "version": "1.0.0",
      "type": "sentence",             // sentence | srt | dichotic_digits | matrix
      "language": "es",
      "region": "ES",                 // opcional
      "license": "CC-BY",
      "source": "https://zenodo.org/records/3547446",
      "citation": "Aubanel, García Lecumberri, Cooke (2014) Int J Audiol",
      "lists": 70,
      "items": 700,
      "keywords_per_item": 5,
      "text_url": "catalogs/sharvard-es-v1.json",
      "text_sha256": "…",
      "audio_packs": [
        {
          "voice": "F",
          "release_tag": "sharvard-audio-v1",
          "asset_name": "sharvard-es-f-v1.tar.gz",
          "sha256": "…",
          "bytes": 265000000,
          "format": "wav",
          "sample_rate": 48000,
          "channels": 1
        }
      ]
    }
  ]
}
```

## Formato `catalogs/<id>-v<N>.json`

```jsonc
{
  "id": "sharvard-es",
  "version": "1.0.0",
  "lists": [
    {
      "code": "SHARVARD_ES_L01",
      "name": "Sharvard ES Lista 1",
      "description": "…",
      "items": [
        {
          "pos": 1,
          "token": "Hay gemas de gran valor en la tienda.",
          "keywords": ["hay","gemas","gran","valor","tienda"],
          "audio_id": "shd001"          // mapea a nombre de archivo en el pack
        }
      ]
    }
  ]
}
```

## Contribuir catálogos nuevos

1. Poné la fuente original en `sources/<catalog-id>/` (PDF, txt, audios propios).
2. Agregá un script en `scripts/build-<catalog-id>.mjs` que emita el JSON a `catalogs/<id>-vN.json`.
3. Calculá SHA256: `sha256sum catalogs/<id>-vN.json`.
4. Si hay audios, empaquetá un tarball `<id>-<voice>-vN.tar.gz` con archivos nombrados por `audio_id` (ej. `shd001.wav`).
5. Subí el tarball como asset de un GitHub Release con tag `<id>-audio-vN`.
6. Actualizá `index.json` con entradas nuevas + hashes.
7. PR.

## Licencias

Cada catálogo declara su licencia en `index.json`. Solo se incluyen materiales de libre redistribución. Para corpus cerrados (ej. Matrix-ES audios de HörTech, HINT-Spanish del House Ear Institute) incluimos solo la **estructura** (palabras/frases) — los audios deben grabarse por el usuario.
