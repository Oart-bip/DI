
## Como Rodar

### Backend (porta 3001)
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
npm run start:dev
```

### Frontend (porta 3000)
```bash
cd frontend
npm install
npm run dev
```
Acesse: http://localhost:3000

### Python 
```bash
cd ml
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```
---

