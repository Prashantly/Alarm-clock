const selectMenu = document.querySelectorAll("select");
const currentTime = document.querySelector("h1");
const setAlarmBtn = document.getElementById("set");
const stopAlarmBtn = document.getElementById("stop");
const getAlarmList = document.getElementById("alarm-list");
let alarmsArray = [];
localStorage.setItem("alarms", JSON.stringify(alarmsArray));
let alarmSound = new Audio("./files/alarm.mp3");
alarmSound.loop = true;

//setting 12 hours option values
for (let i = 12; i >= 0; i--) {
  let option = document.createElement("option");
  i = i < 10 ? "0" + i : i;
  option.value = i;
  option.innerHTML = i;
  selectMenu[0].firstElementChild.insertAdjacentElement("afterend", option);
}

//setting 60 minutes option values
for (let i = 59; i >= 0; i--) {
  i = i < 10 ? "0" + i : i;
  let option = `<option value="${i}">${i}</option>`;
  selectMenu[1].firstElementChild.insertAdjacentHTML("afterend", option);
}

//setting 60 seconds option values
for (let i = 59; i >= 0; i--) {
  i = i < 10 ? "0" + i : i;
  let option = `<option value="${i}">${i}</option>`;
  selectMenu[2].firstElementChild.insertAdjacentHTML("afterend", option);
}

// ----------------------**** functions ****-----------------------------------------------------------
//showing alarms in upcoming alarm list
function showNewAlarm() {
  getAlarmList.innerHTML = "";
  alarmsArray.forEach((alarm, index) => {
    const newAlarmItem = `<li data-time=${alarm} id=${index}>
    <div>${alarm}</div>
    <div>Alarm ${index + 1}</div>
    <button class="delete" onclick="deleteAlarm(${index})">Delete</button>
  </li>`;

    getAlarmList.innerHTML += newAlarmItem;
  });
}

//after user click set Alarm button selct otions should get reset to default values
function clearAlarm() {
  selectMenu[0].value = "Hour";
  selectMenu[1].value = "Minute";
  selectMenu[2].value = "Second";
  selectMenu[3].value = "AM/PM";
}

//delete alarm
function deleteAlarm(alarmId) {
  alarmsArray.splice(alarmId, 1);
  localStorage.setItem("alarms", JSON.stringify(alarmsArray));
  showNewAlarm();
}

function notificationBar(ttl, msg, messageType) {
  //messageType --> success,error, warning
  // Create a new notification element
  const notification = document.createElement("div");
  notification.classList.add("notification");

  const title = document.createElement("h2");
  title.innerText = ttl;
  notification.appendChild(title);

  const message = document.createElement("p");
  message.innerText = msg;
  notification.appendChild(message);

  notification.classList.add(messageType);
  document.body.appendChild(notification);

  // Remove the notification after a delay of 2 seconds
  setTimeout(() => {
    document.body.removeChild(notification);
  }, 2000);
}

//update Timer
function updateTimer() {
  //getting hours minutes seconds
  let date = new Date();
  let hour = date.getHours();
  let minute = date.getMinutes();
  let second = date.getSeconds();
  let ampm = "AM";

  if (hour >= 12) {
    hour = hour - 12;
    ampm = "PM";
  }

  //   if hour value is 0, set this value to 12
  hour = hour == 0 ? (h = 12) : hour;

  //adding 0 before hour minute second if the value is than 10
  hour = hour < 10 ? "0" + hour : hour;
  minute = minute < 10 ? "0" + minute : minute;
  second = second < 10 ? "0" + second : second;

  currentTime.innerText = `${hour}:${minute}:${second} ${ampm}`;
}

//user clicks setAlarm button to set alarm
function setAlarm(e) {
  e.preventDefault();
  //getting hour minute second and am/pm values from select buttons
  const time = `${selectMenu[0].value}:${selectMenu[1].value}:${selectMenu[2].value} ${selectMenu[3].value}`;
  //console.log(time);
  if (
    time.includes("Hour") ||
    time.includes("Minute") ||
    time.includes("Second") ||
    time.includes("AM/PM")
  ) {
    notificationBar("Warning!!", "Select valid time to set Alarm!!", "warning");
    return;
  }

  let alarmTime = time;

  if (!alarmsArray.includes(alarmTime)) {
    alarmsArray.push(alarmTime);
    localStorage.setItem("alarms", JSON.stringify(alarmsArray));
    // console.log(alarmsArray);
    showNewAlarm();
    clearAlarm();
    notificationBar("Success!!", "Alarm successfully set.", "success");
  } else {
    notificationBar(
      "Error:(",
      `Alarm for ${alarmTime} already exists. `,
      "error"
    );
  }
}

// alarm ringing function
function ringAlarm() {
  if (alarmsArray.length > 0) {
    const index = alarmsArray.indexOf(currentTime.innerText);

    if (index != -1) {
      notificationBar(
        "Success!!",
        `Alarm for ${alarmsArray[index]} Ringing...`,
        "success"
      );
      alarmSound.play();
      isAlarmRinging = true;
      document.body.classList.add("ringing");
    }
  }
}

//stop alarm function
function stopAlarm() {
  if (isAlarmRinging) {
    alarmSound.pause();
    alarmSound.currentTime = 0;
    isAlarmRinging = false;
    document.body.classList.remove("ringing");
    notificationBar("Success!!", "Alarm stopped.", "success");
  } else {
    notificationBar("Warning!!", "No alarm is ringing right now.", "warning");
  }
}

// setInterval function
setInterval(() => {
  ringAlarm();
  updateTimer();
}, 1000);

// event listners
setAlarmBtn.addEventListener("click", setAlarm);
stopAlarmBtn.addEventListener("click", stopAlarm);
