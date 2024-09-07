document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("btn").addEventListener("click", function() {
        const username = document.getElementById("uname").value;
        const password = document.getElementById("pass").value;
        loginAndFetchUserData(username, password);
    });
});

function loginAndFetchUserData(username, password) {
    const token = 'your_moodle_token'; // Replace with your Moodle token
    const moodleUrl = 'https://your-moodle-site.com/webservice/rest/server.php';
    const wsfunction = 'core_user_get_users_by_field';
    const field = 'username';

    const url = `${moodleUrl}?wstoken=${token}&wsfunction=${wsfunction}&moodlewsrestformat=json&field=${field}&values[0]=${username}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            document.getElementById("response").textContent = JSON.stringify(data, null, 2);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}



// https://moodle.univ-ubs.fr/mod/attendance/view.php?id=421553
// /html/body/div[3]/div[4]/div/div/div[2]/div/section/div[2]/div[2]/table/tbody/tr[2]/td[3]/a
// /html/body/div[3]/div[4]/div/div/div[2]/div/section/div[2]/div[2]/table/tbody/tr[3]/td[3]/a