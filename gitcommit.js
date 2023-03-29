const checkCustomKeywords = ['fundwave', 'getfundwave']

async function searchKeywordsInRepo() {
    let result = await Promise.all(checkCustomKeywords.map(async object => {
        const apiUrl = `https://api.github.com/search/code?q=${object}`
        let response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/vnd.github+json',
                'Authorization': 'Bearer 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',
                'X-GitHub-Api-Version': '2022-11-28'
            },
        })
        if (response.ok) {
            let text = await response.text();
            let data = JSON.parse(text);
            let loginName = data.items.map(item => item.repository.owner.login)
            let checkRepoId = data.items.map(item => item.repository.id)
            let htmlLink = data.items.map(item => item.html_url)
            let i = 0;
            const todayDate = new Date().toISOString().split('T')[0]
            const todayTime = new Date().toLocaleString().split(',')[1].trim()
      //      console.log(checkRepoId)
            const vulnerableDomainPayload = [];
            for (let checkLogin in loginName) {
                 
               // console.log(`keyname of the file is : "${object}" and Account id is: ${loginName[checkLogin]}`)
                if (loginName[checkLogin] == "getfundwave") {
                    console.log(`${object} is in the ${loginName[checkLogin]} : Don't alert on slack`)
                }
                else {
                    vulnerableDomainPayload.push({
                        "type": "section",
                        "fields": [
        
                            {
                                "type": "mrkdwn",
                                "text": `*<${htmlLink[i]}|${checkRepoId[i]}>*`
                            }
                        ]
                    })
                    i++;
                }
            }
            const notificationPayload = {
                channel: 'git-commit',
                blocks: [
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": `*Github Check Report* @${todayDate}`
                        }
                    },
                    {
                        "type": "section",
                        "fields": [

                            {
                                "type": "mrkdwn",
                                "text": `*Date:*\n${todayDate}`
                            },
                            {
                                "type": "mrkdwn",
                                "text": `*Posted time:*\n${todayTime}`
                            }
                        ]
                    },
                    {
                        "type": "section",
                        "fields": [

                            {
                                "type": "mrkdwn",
                                "text": `*Keyword:*\n${object}`
                            },
                            {
                                "type": "mrkdwn",
                                "text": `*Total Number of Repos:*\n${i}`
                            }
                        ]
                    },
                    {
                        "type": "section",
                        "fields": [

                            {
                                "type": "mrkdwn",
                                "text": "*List of Repositories:*"
                            },
                            
                        ]
                    },
                    ...vulnerableDomainPayload
                ]
            }

            await fetch("https://hooks.slack.com/services/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", {
                method: "POST",
                body: JSON.stringify(notificationPayload),
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json; charset=utf-8"
                }

            }).then(() => console.log("Successfully notified on slack!"));
        } else {
            return `HTTP error: ${response.status}`
        }

    }));

}
searchKeywordsInRepo();