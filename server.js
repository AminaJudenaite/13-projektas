const express = require('express');
const app = express();
app.use(express.json());

const PORT = 3000;

let students = [
    { id: 1, name: "Jonas Jonaitis", code: "S123", attended: true, grade: null, password: "p1" },
    { id: 2, name: "Petras Petraitis", code: "S456", attended: false, grade: null, password: "p2" }
];

app.post('/api/instructor/students', (req, res) => {
    const { name, code, attended, password } = req.body;
    const newStudent = { id: students.length + 1, name, code, attended, grade: null, password };
    students.push(newStudent);
    res.status(201).json({ message: "Studentas priregistruotas", student: newStudent });
});

app.get('/api/instructor/students', (req, res) => {
    res.json(students.map(s => ({ id: s.id, name: s.name, code: s.code, attended: s.attended })));
});

app.patch('/api/instructor/students/:id/grade', (req, res) => {
    const studentId = parseInt(req.params.id);
    const { grade } = req.body;

    if (grade < 1.5 || grade > 3) {
        return res.status(400).json({ error: "Balas turi būti tarp 1.5 ir 3" });
    }

    const student = students.find(s => s.id === studentId);
    if (!student) return res.status(404).json({ error: "Studentas nerastas" });

    student.grade = grade;
    res.json({ message: `Studentui ${student.name} įrašytas balas: ${grade}` });
});

app.post('/api/student/view-grade', (req, res) => {
    const { code, password } = req.body;
    const student = students.find(s => s.code === code && s.password === password);

    if (!student) return res.status(401).json({ error: "Neteisingas kodas arba slaptažodis" });

    res.json({ name: student.name, grade: student.grade || "Įvertinimas dar nepaskelbtas" });
});

app.post('/api/student/request-review', (req, res) => {
    const { code, password, reason } = req.body;
    const student = students.find(s => s.code === code && s.password === password);

    if (!student) return res.status(401).json({ error: "Autentifikacijos klaida" });

    console.log(`Gautas prašymas peržiūrai iš ${student.name}. Priežastis: ${reason}`);
    res.json({ message: "Prašymas peržiūrėti įvertinimą sėkmingai išsiųstas" });
});

app.listen(PORT, () => {
    console.log(`Serveris veikia adresu http://localhost:${PORT}`);
});