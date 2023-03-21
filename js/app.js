document.addEventListener("DOMContentLoaded", function(){
    const USERNAME_KEY = "userName";
    const TODOLISTARR_KEY = "todoListArr";
    const WEATHERAPI_KEY = "eee1b91513ec507358d50dc63e709074";

    const wrap = document.querySelector("#wrap");
    const loginBox = document.querySelector(".loginBox");
    const formLogin = document.querySelector(".formLogin");
    const inputUserName = document.querySelector("#userName");
    const inputListMaker = document.querySelector("#inputListMaker");
    let todoListArr = JSON.parse(localStorage.getItem(TODOLISTARR_KEY)) ? JSON.parse(localStorage.getItem(TODOLISTARR_KEY)) : [];
    const bgArr = ["bg1.jpg", "bg2.jpg", "bg3.jpg", "bg4.jpg"]

    //로그인 여부 확인
    let isLogin = function(){
        if(localStorage.getItem(USERNAME_KEY) !==  null){
            return true;
        }
        return false;
    }

    if(isLogin()){
        renderContent();
    }else{
        wrap.classList.remove("logined");
    }

    eventListener();

    function eventListener(){
        formLogin.addEventListener("submit", loginCheck);

        inputUserName.addEventListener("input", function(){
            if(inputUserName.value.length !== 0){
                document.querySelector(".loginMid p").style.color = "green";
            }else{
                document.querySelector(".loginMid p").style.color = "red";
            }
        });

        loginBox.addEventListener("animationend", function(){
            loginBox.style.animationName = "none";
        });

        document.querySelector(".formListMaker").addEventListener("submit", submitList);
    };

    function renderContent(){
        wrap.classList.add("logined");
        document.querySelector(".content .userName").innerText = localStorage.getItem(USERNAME_KEY);
        time();
        setInterval(time, 1000);
        loadBg();
        loadList();

        // console.log(navigator.geolocation)
        navigator.geolocation.getCurrentPosition(onGeoOk, onGeoErr);

    }

    function loadBg(){
        document.querySelector("#wrap.logined").style.backgroundImage = `url(images/${bgArr[Math.floor(Math.random() * bgArr.length)]})`;
    }

    function loadList(){
        todoListArr.forEach(renderList);
    }

    function renderList(todo){
        const li = document.createElement("li");
        li.id = todo.id;
        const span = document.createElement("span");
        const button = document.createElement("button");
        button.className = "btnDel";
        button.addEventListener("click", delList)
        li.appendChild(span);
        li.appendChild(button);
        span.innerText = todo.text;
        button.innerText = "삭제";
        document.querySelector(".right .todoList").appendChild(li);

    };

    function submitList(event){
        event.preventDefault();

        if(inputListMaker.value.length !== 0){
            const newTodos = {
                id : Date.now(),
                text : inputListMaker.value
            };
            todoListArr.push(newTodos);
            renderList(newTodos);
            saveList();
            document.querySelector(".formListMaker").reset();
        }else{
            alert("내용을 입력하세요");
        }
    }

    function delList(event){
        const li = event.target.parentElement;
        li.remove();
        todoListArr = todoListArr.filter((item) => item.id !== parseInt(li.id)); //id가 다르면 남겨두자
        saveList();
    };

    function saveList(){
        localStorage.setItem(TODOLISTARR_KEY, JSON.stringify(todoListArr));
    }

    function loginCheck(event){
        event.preventDefault();

        if(inputUserName.value.length !== 0){
            loginSubmit();
        }else{
            loginBox.style.animationName = "shake";
        }

    };

    function loginSubmit(){
        localStorage.setItem(USERNAME_KEY, inputUserName.value);

        renderContent();
        formLogin.reset();
    }

    function time(){
        let today = new Date();
        let year = today.getFullYear(); //년도
        let month = String(today.getMonth()+1); //월
        let date = String(today.getDate()); //일
        let day = today.getDay(); //요일
        let week = ["일", "월", "화", "수", "목", "금", "토"]; //요일
        let hours = today.getHours() //시
        let minutes = String(today.getMinutes()).padStart(2,"0"); //분
        let seconds = String(today.getSeconds()).padStart(2,"0"); //초
        let ampm = ""; //오전오후

        if(hours === 24){
            ampm = "오전";
            hours = 0;
        }else if(hours < 12) {
            ampm = "오전";
        }else if(hours === 12){
            ampm = "오후";
        }else if(hours > 12){
            ampm = "오후";
            hours = hours - 12;
        }

        document.querySelector(".timeWrap .clock").innerText = `${ampm} ${String(hours)}:${minutes}:${seconds}`;
        document.querySelector(".timeWrap .date").innerText = `${year}년 ${month}월 ${date}일 ${week[day]}요일`;
    }

    function onGeoOk(position){
        // console.log(position)
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHERAPI_KEY}&units=metric`
        fetch(url).then(response => response.json()).then(data => {
            const name = data.name;
            const weather = data.weather[0].main;
            const temp = data.main.temp;
            document.querySelector(".weather p").innerText = `${name} ${weather} ${temp}`
        })
    };

    function onGeoErr(){
        alert("위치를 알 수 없습니다.");
    };


});
