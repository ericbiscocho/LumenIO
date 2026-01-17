# LumenIO

## Development Setup

### Requirements
- Python 3.13+
- Django 6.0.1+
- PostgreSQL

### Setup
```bash
python -m venv .venv
.venv\Scripts\activate      # Windows
source .venv/bin/activate   # Unix/MacOS
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
