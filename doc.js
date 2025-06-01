
let age = [30, 10, 20 , 10, 80]
console.log(age)

console.log(age.sort())

let names_list = ['tae', 'earn', 'pong','kai' ]
names_list.push('ios')
console.log(names_list)
console.log(names_list.sort())
console.log(names_list.length)

for(let i = 0; i<names_list.length; i++){
    console.log('ชื่อ',names_list[i] + ' อายุ',String(age[i]))
}

let student = [
    {
        age: 30,
        nickname: 'tae',
        gender: 'male'
    },
    {
        age: 32,
        nickname: 'pong',
        gender: 'male'
    },
    {
        age: 40,
        nickname: 'uri',
        gender: 'female'
    },
]
student.push (
    {
        age: 20,
        nickname: 'Hong',
        gender: 'male'
    }
)
console.log(student[2].age)

for(let i = 0; i<student.length; i++){
    console.log('ชื่อ',student[i].nickname + ' อายุ',String(student[i].age))
}

let score = 800
let grade = ''

//ประกาศ funtion
function calculation_grade (score ){
    if (score >= 80){
        grade = 'A'
    } else if (score >= 70){
        grade = 'B'
    } else if (score >= 60){
        grade = 'C'
    } else if (score >= 50){
        grade = 'D'
    } else{
        grade = 'E'
    }
    return grade //ออกข้อมูล
}

let calculation_grade1 = (score) =>{
    if (score >= 80){
        grade = 'A'
    } else if (score >= 70){
        grade = 'B'
    } else if (score >= 60){
        grade = 'C'
    } else if (score >= 50){
        grade = 'D'
    } else{
        grade = 'E'
    }
    return grade //ออกข้อมูล
}
//เรียกใช้ funtion
let grade1 = calculation_grade(score)
let grade2 = calculation_grade1(score)

console.log(grade1)

console.log('form funtion arrow',grade2)

// score[0] = score[0] * 2
// score[1] = score[1] * 2
// score[2] = score[2] * 2
// score[3] = score[3] * 2

score = score.map((s) => {
    return s* 2
})

score.forEach((s)=>{
    console.log('by .map * 2 score: ',s)
})

