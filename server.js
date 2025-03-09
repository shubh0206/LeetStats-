const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(express.json());

app.post('/leetcode', async (req, res) => {
    try {
        const { username } = req.body;
        console.log("Received username:", username); // Log the username

        const graphqlQuery = {
            query: `
                query userSessionProgress($username: String!) {
                    allQuestionsCount {
                        difficulty
                        count
                    }
                    matchedUser(username: $username) {
                        submitStats {
                            acSubmissionNum {
                                difficulty
                                count
                                submissions
                            }
                            totalSubmissionNum {
                                difficulty
                                count
                                submissions
                            }
                        }
                    }
                }
            `,
            variables: { username }
        };

        console.log("Sending request to LeetCode API with query:", graphqlQuery); // Log the query

        const response = await axios.post('https://leetcode.com/graphql/', graphqlQuery, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log("Response from LeetCode API:", response.data); // Log the response
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching data from LeetCode:", error.message);
        res.status(500).json({ error: "Unable to fetch data from LeetCode" });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});