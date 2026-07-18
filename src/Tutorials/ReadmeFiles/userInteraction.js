const helperMsg = ['Haan bol', 'Haan bol de 😒', 'chal maan bhi jaa 😢', 'Maan bhi jaa ab 😠', 'Paka naa hai tumhara? 🤨', 'Ek side ka ticket mere taraf se 🫤', 'Chal dono side ka 🙃']
const datePeChalegi = () => {
    let messageIndex = 0
    const promptAns = prompt("Answer bata -> \n const ans = 'Date' || '' \n Write value of ans 👇")
    let confirmAns = confirm('Date pe chalegi?')
    while (!confirmAns && messageIndex < 7) {
        confirmAns = confirm(helperMsg[messageIndex])
        messageIndex++;
    }
    if (messageIndex < 3) alert('Haiyn, Itna jldi maan gyi. Something is fishy 🤨')
    if (messageIndex === 7) alert('Lagta hai, Ab kisi aur ko hi dekhna hoga 😞')
    else alert('Sach mein.😍 Tum husn pari tum jaane jahan, tum sabse hasi tum sabse jawan')
}

datePeChalegi()


