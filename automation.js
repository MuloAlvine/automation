var xlsx = require("xlsx");

var wb = xlsx.readFile("index.xlsx");
//console.log(wb.SheetNames);
var wsC = wb.Sheets["Countries"];   
var countries = xlsx.utils.sheet_to_json(wsC);
//console.log(countries);

var wsTopics = wb.Sheets["Topics"];
var allTopics = xlsx.utils.sheet_to_json(wsTopics);
//console.log(allTopics);

var wsInputs = wb.Sheets["Input"];
var input =  xlsx.utils.sheet_to_json(wsInputs);
// console.log(input);

var wsPriorities = wb.Sheets["Priority"];
var priority = xlsx.utils.sheet_to_json(wsPriorities);

let priorityList = [];

Object.keys(priority).forEach(function(keyP){

    priorityList.push(priority[keyP]);
})
// console.log(priorityList);

//sorting the array prioritylist in an descending order 
let prioritySorted = priorityList.filter((x)=>
Number.isInteger(x.Priority)).sort((a, b)=>
a.Priority < b.Priority ? 1 : -1);

// console.log(prioritySorted);
// console.log(" ");

function topicLookup(topic)
{

    return allTopics.filter((item) =>
        item.Topic === topic 
    )[0]

}
//The next three lines are bad practices but can be fixed
var global_default = input.filter((d) =>d.Category === 'global=default')[0]
var global_default_list = [topicLookup(global_default.firstTopic), topicLookup(global_default.secondTopic), topicLookup(global_default.thirdTopic)];



var default_topics_list = [];

Object.keys(countries).forEach(function(key){

    let currentCountry = countries[key]

  

    //looping through all countries and create a list of 

        
    var list = [];

    //looping through the priority list
    prioritySorted.forEach((p)=>{
        p.CategoryLower = p.Category.toLowerCase();
        let inputKey =  p.CategoryLower+"="+currentCountry[p.Category];
        //console.log(inputKey);
        
        if(currentCountry[p.Category])
        {
 
             input.forEach((i)=>{
                 if(i.Category === inputKey)
                 {
                     
                  // console.log(currentCountry.Code, currentCountry.Country, inputKey, i, topicLookup(i.firstTopic));

                  i.firstTopic && list.push(topicLookup(i.firstTopic));
                  i.secondTopic && list.push(topicLookup(i.secondTopic));
                  i.thirdTopic && list.push(topicLookup(i.thirdTopic));

                 }
            })
        }
    })
    list = [...list, ...global_default_list].slice(0,3)
    default_topics_list.push({"country": currentCountry.Code, "topiclist":list})
    
    
})
//console.log(default_topics_list);

const fs = require('fs');

const saveData = (data) =>{
    const finished = (error)=>{
        if(error){
            console.error(error);
            return;
        }
    }

    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFile('data.json',jsonData,finished);
}

saveData(default_topics_list);

