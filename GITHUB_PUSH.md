# GitHub-қа жіберу (push) қадамдары

Терминалды ашып, LMS жоба қалтасына кіріңіз, содан кейін төмендегі командаларды бірінен соң бірі орындаңыз.

## 1. Жоба қалтасына кіру (егер әлі кірмеген болсаңыз)
```bash
cd C:\Users\nurka\Downloads\LMS
```

## 2. Git репозиторийін іске қосу
```bash
git init
```

## 3. GitHub remote қосу
```bash
git remote add origin https://github.com/nurzh07/library-management-system.git
```

## 4. Барлық файлдарды қосу
```bash
git add .
```

## 5. Бірінші коммит жасау
```bash
git commit -m "Initial commit: LMS frontend and backend"
```

## 6. Негізгі тармақты main деп атау
```bash
git branch -M main
```

## 7. GitHub-қа жіберу
```bash
git push -u origin main
```

---

**Ескерту:** `git push` кезінде GitHub логин/пароль немесе **Personal Access Token** сұрауы мүмкін. Егер 2FA қосылған болса, пароль орнына token қолданыңыз.  
Token: GitHub → Settings → Developer settings → Personal access tokens.
