console.log('hello form JS')
function submitData(){
    let firstNameInput = document.querySelector('input[name=firstname]')
    let lastNameInput = document.querySelector('input[name=lastname]')
    let ageInput = document.querySelector('input[name=age]')

    let genderInput = document.querySelector('input[name=gender]:checked')
    let interestInput = document.querySelectorAll('input[name=interest]:checked')

    let interest = ''

    for (let i = 0; i < interestInput.length; i++){
        interest += interestInput[i].value 
        if (i != interestInput.length - 1){
            interest += ', '
        }
            
    }


    let descriptionInput = document.querySelector('textarea[name=description]')
    
    let userData = {
        firstname: firstNameInput.value,
        lastname: lastNameInput.value,
        age: ageInput.value,
        gender: genderInput.value,
        interest: interest,
        description: descriptionInput.value,
    }
    
    
    // let firstname = firstNameInput.value;
    // let lastname = lastNameInput.value;
    // let age = ageInput.value;
    console.log(userData)
    console.log('hello form submit')
}