document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.getElementById("search-btn");
    const usernameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");
    const cardStatsContainer = document.querySelector(".stats-cards");

    // Fetch user details from LeetCode API
    async function fetchUserDetails(username) {
        try {
            searchButton.textContent = "Searching...";
            searchButton.disabled = true;

            // Updated URL to point to Render backend
            const response = await fetch('https://leetstats-4.onrender.com/leetcode', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username }),
            });

            if (!response.ok) {
                throw new Error("Unable to fetch the User details");
            }
            const parsedData = await response.json();
            console.log("Logging data: ", parsedData);

            // Check if matchedUser is null
            if (!parsedData.data.matchedUser) {
                throw new Error("Username not found on LeetCode");
            }

            displayUserData(parsedData);
        } catch (error) {
            statsContainer.innerHTML = `<p class="error">${error.message}</p>`;
        } finally {
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }

    // Update progress circles and labels
    function updateProgress(solved, total, label, circle) {
        const progressDegree = (solved / total) * 100;
        circle.style.setProperty("--progress-degree", `${progressDegree}%`);
        label.textContent = `${solved}/${total}`;
    }

    // Display user data in the UI
    function displayUserData(parsedData) {
        const totalEasyQues = parsedData.data.allQuestionsCount[1].count;
        const totalMediumQues = parsedData.data.allQuestionsCount[2].count;
        const totalHardQues = parsedData.data.allQuestionsCount[3].count;

        const solvedTotalEasyQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[1].count;
        const solvedTotalMediumQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[2].count;
        const solvedTotalHardQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[3].count;

        updateProgress(solvedTotalEasyQues, totalEasyQues, easyLabel, easyProgressCircle);
        updateProgress(solvedTotalMediumQues, totalMediumQues, mediumLabel, mediumProgressCircle);
        updateProgress(solvedTotalHardQues, totalHardQues, hardLabel, hardProgressCircle);

        const cardsData = [
            { label: "Overall Submissions", value: parsedData.data.matchedUser.submitStats.totalSubmissionNum[0].submissions },
            { label: "Overall Easy Submissions", value: parsedData.data.matchedUser.submitStats.totalSubmissionNum[1].submissions },
            { label: "Overall Medium Submissions", value: parsedData.data.matchedUser.submitStats.totalSubmissionNum[2].submissions },
            { label: "Overall Hard Submissions", value: parsedData.data.matchedUser.submitStats.totalSubmissionNum[3].submissions },
        ];

        cardStatsContainer.innerHTML = cardsData.map(
            data => `
                <div class="card">
                    <h4>${data.label}</h4>
                    <p>${data.value}</p>
                </div>
            `
        ).join("");
    }

    // Add click event listener to the search button
    searchButton.addEventListener('click', function () {
        const username = usernameInput.value;
        if (username.trim() !== "") {
            fetchUserDetails(username);
        } else {
            alert("Please enter a username");
        }
    });
});