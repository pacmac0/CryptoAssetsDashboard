function generate_table(table_data) {
  // get the reference for the body
  var tbl = document.getElementById("dataTable");

  // creates all table elements
  var tblHead = document.createElement("thead");
  var tblFoot = document.createElement("tfoot");
  var tblBody = document.createElement("tbody");
  //create header and footer
  var headers = ['#', 'Name', 'Price $', 'Change(24h)', 'Change(7d)', 'Market-Cap.', 'Circulation-Supply', 'Volume.(24h)']
  var headRow = document.createElement("tr");
  for (var head in headers) {
    var cell = document.createElement("th");
    var cellText = document.createTextNode(headers[head]);
    cell.appendChild(cellText);
    headRow.appendChild(cell);
  }
  var footRow = headRow.cloneNode(true);
  tblHead.appendChild(headRow);
  tblFoot.appendChild(footRow);

  // creating table body cells
  for (var coin in table_data) { // coin is the key which is numeric and ordered from 0 up
      // creates a table row
      var row = document.createElement("tr");
      //create table rows (change case number for order of cells)
      for (var j = 0; j < 8; j++) {
          // path in data ['quote.USD.price', 'quote.USD.percent_change_24h', 'quote.USD.percent_change_7d'];
          var text = "";
          switch (j) {
              case 0:
                text = (parseInt(coin) + 1).toString();
                break;
              case 1:
                text = table_data[coin].name;
                break;
              case 5:
                text = convertNumberStr(table_data[coin].quote.USD.market_cap);
                break;
              case 6:
                text = convertNumberStr(table_data[coin].circulating_supply);
                break;
              case 7:
                text = convertNumberStr(table_data[coin].quote.USD.volume_24h);
                break;
              case 2:
                text = '$'.concat(convertNumberStr(table_data[coin].quote.USD.price));
                break;
              case 3:
                text = convertNumberStr(table_data[coin].quote.USD.percent_change_24h);
                if(!text.includes('-')) {
                    text = '+'.concat(text)
                }
                break;
              case 4:
                text = convertNumberStr(table_data[coin].quote.USD.percent_change_7d);
                if(!text.includes('-')) {
                    text = '+'.concat(text)
                }
                break;
              default:
                text = "No value found!";
          }

          cell = document.createElement("td");
          cellText = document.createTextNode(text);
          if(text.toString().includes('-')) {
            cell.style.color = "#D94040";
          }
          else if(text.toString().includes('+')) {
            cell.style.color = "#00AABB";
          }
          cell.appendChild(cellText);
          row.appendChild(cell);
      }
      tblBody.appendChild(row)
  }
  tbl.appendChild(tblHead);
  tbl.appendChild(tblFoot);
  tbl.appendChild(tblBody);
}

function convertNumberStr(text) {
    var str = parseFloat(text).toFixed(2).replace('.', ',').split("").reverse().join("").match(/.{1,3}/g);
    var convStr = str[0] + str[1];
    for(var i=2; i<str.length; i++) {
        convStr = convStr + "." + str[i]
    }
    return convStr.split("").reverse().join("");
}

function tableLoad() {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          var table_data = JSON.parse(this.responseText);
          generate_table(table_data['data']);
      }
    };
    request.open("GET", 'http://127.0.0.1:1337/dataload', true);
    request.send();
    return false
}

function deleteAsset(asset) {
    var assetArgs = asset.substring(6, asset.length-1).split(', ');
    assetArgs.forEach(function(arg, idx, assetArgs){
        assetArgs[idx] = arg.substring(1, arg.length-1);
        //alert(arg.substring(1, arg.length-1) + '\n' + arg)
    });

    var request = new XMLHttpRequest();
    request.open("POST", 'http://127.0.0.1:1337/asset/delete', true);
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    request.send(assetArgs[0]); // send asset-id

    document.getElementById('assetHistNo'+assetArgs[0]).remove();
    var sum = document.getElementById('assetSum').textContent;
    document.getElementById('assetSum').textContent = parseFloat(sum) - parseFloat(assetArgs[2]);
    return false
}

// onload start!!!
$(document).ready(function() {
    tableLoad()
});







