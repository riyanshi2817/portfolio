const item = document.getElementById('item');
const listItems = document.getElementsByClassName('listItem');

item.addEventListener('input' , function(){
    const inputText = item.value.toLowerCase();

    for(let li of listItems){
        let ListText = li.textContent.toLowerCase();

        if(ListText.includes(inputText)){
            li.style.display = 'block';
        }
        else{
            li.style.display = 'none';
        }
    }
});