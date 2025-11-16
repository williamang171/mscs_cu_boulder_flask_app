## Command to create Zip File for submission

```bash
zip -r brewery_finder.zip . -x '*.DS_Store' -x '*.git*' -x '*/node_modules/*' -x '*/__pycache__/*' -x 'venv/*'
```
