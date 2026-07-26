# Otomatik yayın (isteğe bağlı)

Şu an yayın elle yapılıyor (`npm run deploy`). Her `git push` sonrası
otomatik yayınlamak istersen:

1. GitHub token'ına workflow yetkisi ver:

   ```bash
   gh auth refresh -s workflow
   ```

2. İş akışını yerine koy ve gönder:

   ```bash
   mkdir -p .github/workflows
   cp docs/github-pages-workflow.yml .github/workflows/deploy.yml
   git add .github && git commit -m "CI: Pages yayini" && git push
   ```

3. GitHub'da **Settings → Pages → Source** ayarını `GitHub Actions` yap.
