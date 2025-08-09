# Granula - Task Management for African Professionals

Granula is a productivity and task management application designed specifically for African professionals, students, and teams. Built with an offline-first approach to handle connectivity challenges while providing powerful collaboration and AI-assisted features.

## 🎯 Features

### Core Features
- **Task Management**: Create, assign, and track tasks with priorities and deadlines
- **Team Collaboration**: Real-time team chat and file sharing
- **Project Management**: Organize work into projects with multiple team members
- **Offline-First**: Full functionality even without internet connection
- **Low Data Mode**: Optimized for minimal data usage

### AI Features (Premium)
- Smart task prioritization
- Meeting notes to action items conversion
- Automated task assignment suggestions
- Performance insights and recommendations
- Auto-generated checklists for common tasks

## 🏗️ Architecture

```
granula/
├── apps/
│   ├── api/          # Flask backend with blueprints
│   └── web/          # React PWA frontend
├── packages/         # Shared packages
├── infra/           # Docker and deployment configs
└── docs/            # Documentation
```

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 20+
- Python 3.11+
- PostgreSQL 15+
- Redis 7+

### Development Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/granula.git
cd granula
```

2. Copy environment files:
```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

3. Start with Docker Compose:
```bash
cd infra
docker-compose up -d
```

4. Access the application:
- Web: http://localhost:3000
- API: http://localhost:5000/api

### Manual Setup

#### Backend (Flask API)
```bash
cd apps/api
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -e ".[dev]"
flask db upgrade
flask run
```

#### Frontend (React)
```bash
cd apps/web
npm install
npm run dev
```

## 🧪 Testing

### API Tests
```bash
cd apps/api
pytest -v --cov=app
```

### Web Tests
```bash
cd apps/web
npm run test
```

## 📦 Deployment

### Using Docker
```bash
cd infra
./scripts/deploy.sh production
```

### Manual Deployment
See [deployment guide](docs/deployment.md) for detailed instructions.

## 🛠️ Technology Stack

### Backend
- **Framework**: Flask with App Factory pattern
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Cache**: Redis
- **Queue**: Celery with Redis broker
- **API**: RESTful with JWT authentication

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Offline Storage**: IndexedDB with Dexie
- **PWA**: Workbox for service workers

### Infrastructure
- **Containerization**: Docker
- **Reverse Proxy**: Nginx
- **CI/CD**: GitHub Actions
- **Monitoring**: OpenTelemetry (planned)

## 📚 Documentation

- [API Guidelines](docs/api-guidelines.md)
- [Offline Sync Protocol](docs/offline-sync.md)
- [Frontend Standards](docs/frontend-standards.md)
- [Architecture Decision Records](docs/ADRs/)

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Python: Black, Ruff, isort
- TypeScript: ESLint, Prettier
- Pre-commit hooks configured

## 📝 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for the African tech community
- Inspired by the need for locally-relevant productivity tools
- Special thanks to all contributors

## 📞 Support

- Email: support@granula.app
- Discord: [Join our community](https://discord.gg/granula)
- Issues: [GitHub Issues](https://github.com/yourusername/granula/issues)

---

Made with ❤️ for Africa