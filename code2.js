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
      //      console.log(checkRepoId)
            const vulnerableDomainPayload = [];
            for (let checkLogin in loginName) {
                 
                console.log(`keyname of the file is : "${object}" and Account id is: ${loginName[checkLogin]}`)
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
                channel: 'production-nmap',
                blocks: [
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": `Daily check for checking the keyword "*${object}*" in below public Repositories : `
                        }
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