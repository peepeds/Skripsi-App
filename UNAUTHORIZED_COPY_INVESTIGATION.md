# Unauthorized Copy Investigation (Issue #37)

## Original project baseline
- **Skripsi-App** first commit: `1a17c61f4d0275a70bcc9960d9ec3de311baabc9` (2026-02-18T12:20:24Z)
- **Skripsi-API** first commit: `66f6fb6ab3bfc20317a7b85dda1d81ff378067e4` (2026-02-18T12:22:15Z)

## Investigation criteria used
1. Repository/product name includes **InternView** and was created/committed after original baseline dates.
2. Stack similarity check for:
   - React frontend
   - Spring Boot backend
   - MinIO object storage
3. Structural/source similarity check between candidate repos and `peepeds/Skripsi-App` + `peepeds/Skripsi-API`.

## Findings

### 1) High-confidence match: `SeedFlora/internview`
- Repository: https://github.com/SeedFlora/internview
- Initial commit: `718fd4ad2de65a41144a4f13f33a2973ba316e76` (2026-07-20T18:13:56Z), later than both original projects.
- Commit message explicitly states a combined monorepo of `api/` (Spring Boot, MinIO) and `app/` (React + Vite).
- Strong file-level similarity evidence:
  - `app/package.json` SHA `5ddfa77dcff5843e3d9fedcc9a7204b506596f50` (same as this repository's `package.json` blob SHA)
  - `api/README.md` SHA `53e9370370d00956662c817ce18b6e24d7fb6a9f` (same as `peepeds/Skripsi-API` `README.md`)
  - Multiple `api/` files and structure mirror `Skripsi-API` layout, while `app/` mirrors `Skripsi-App` layout.

### 2) Potential match requiring manual/legal review: `Ulwus/Internview`
- Repository: https://github.com/Ulwus/Internview
- First commit on default branch history: `8b4d1767ba3ab3f03720080e0001dded6cd3c564` (2026-03-09T22:02:30Z), later than original baseline.
- Uses **Internview** naming and includes:
  - React (Next.js app with `react` dependency)
  - Spring Boot microservices (`spring-boot-starter-*` in multiple backend `pom.xml` files)
  - MinIO references in docs/config (`MINIO_*`, S3-compatible upload flow)
- However, architecture appears broader/different (microservices + mobile + real-time stack), so source-level derivation is **not conclusively established** from this pass.

## Non-matching sampled candidates
Sampled repositories with InternView-like names that did **not** satisfy the full stack criteria (especially Spring Boot + MinIO), e.g.:
- `contactvorito-pixel/AI_Internview`
- `sachin-185/InternView-AI`
- `Jamiha07/InternView_AI`

## Recommended next actions
1. Preserve evidence snapshots (commit SHAs, timestamps, file hashes) for `SeedFlora/internview`.
2. Perform legal/license compliance review for `SeedFlora/internview` first (highest confidence).
3. Perform deeper diff-based code provenance analysis for `Ulwus/Internview` before legal escalation.
