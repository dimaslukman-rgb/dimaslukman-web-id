@echo off
cd /d "c:\Users\ASUS\Documents\Agent Router\portofolio3"
git config user.email "dimaslukman@gmail.com"
git config user.name "Dimas Lukman"
git add -A
git commit -m "Initial commit"
git remote add origin https://github.com/dimaslukman-rgb/dimaslukman-web-id.git
git branch -M main
git push -u origin main