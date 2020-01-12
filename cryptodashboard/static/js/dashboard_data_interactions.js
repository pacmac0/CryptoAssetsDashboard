// global shared data
let coin_data = new Object();
let user_assets = new Object();

function getCoinData() {
    return axios.get('http://127.0.0.1:1337/dataload')
        .then(res => {
            coin_data = res.data.data;
        })
        .catch(err => console.error(err));
}

function getUserAssets() {
    return axios.get('http://127.0.0.1:1337/assetload_by_user')
        .then(res => {
            user_assets = res.data;
        })
        .catch(err => console.error(err));
}

async function generate_coin_table() {
    // get data
  await getCoinData();
  let table_data = coin_data;

  // get the reference for the body
  let tbl = document.getElementById("dataTable");

  // creates all table elements
  let tblHead = document.createElement("thead");
  let tblFoot = document.createElement("tfoot");
  let tblBody = document.createElement("tbody");
  //create header and footer
  let headers = ['#', 'Name', 'Price $', 'Change(24h)', 'Change(7d)', 'Market-Cap.', 'Circulation-Supply', 'Volume.(24h)']
  let headRow = document.createElement("tr");
  for (let head in headers) {
    let cell = document.createElement("th");
    let cellText = document.createTextNode(headers[head]);
    cell.appendChild(cellText);
    headRow.appendChild(cell);
  }
  let footRow = headRow.cloneNode(true);
  tblHead.appendChild(headRow);
  tblFoot.appendChild(footRow);

  // creating table body cells
  for (let coin in table_data) { // coin is the key which is numeric and ordered from 0 up
      // creates a table row
      let row = document.createElement("tr");
      //create table rows (change case number for order of cells)
      for (let j = 0; j < 8; j++) {
          // path in data ['quote.USD.price', 'quote.USD.percent_change_24h', 'quote.USD.percent_change_7d'];
          let text = "";
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
                text = convertNumberStr(table_data[coin].quote.USD.percent_change_24h).concat(" %");
                if(!text.includes('-')) {
                    text = '+'.concat(text)
                }
                break;
              case 4:
                text = convertNumberStr(table_data[coin].quote.USD.percent_change_7d).concat(" %");
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

// converts a String(number) from . to , notation
function convertNumberStr(text) {
    let str = parseFloat(text).toFixed(2).replace('.', ',').split("").reverse().join("").match(/.{1,3}/g);
    let convStr = str[0] + str[1];
    for(let i=2; i<str.length; i++) {
        convStr = convStr + "." + str[i]
    }
    return convStr.split("").reverse().join("");
}

function deleteAsset(assetId) {
    axios.post('http://127.0.0.1:1337/asset/delete', {assetId})
        .then(res => {
            // update asset sum
            let sumCell = document.getElementById('sumCell');
            let assetRow = document.getElementById(assetId);
            sumCell.innerHTML = (parseFloat(sumCell.innerHTML) - parseFloat(assetRow.children[1].innerHTML)).toString();
            assetRow.parentNode.removeChild(assetRow);
        })
        .catch(err => console.error(err));
}

function createPortfolioPieChart() {
    // Set new default font family and font color to mimic Bootstrap's default styling
    Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
    Chart.defaults.global.defaultFontColor = '#858796';

    let ctx = document.getElementById("portfolioPieChart");
    let portfolioPieChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ["Direct", "Referral", "Social"],
        datasets: [{
          data: [55, 30, 15],
          backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc'],
          hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf'],
          hoverBorderColor: "rgba(234, 236, 244, 1)",
        }],
      },
      options: {
        maintainAspectRatio: false,
        tooltips: {
          backgroundColor: "rgb(255,255,255)",
          bodyFontColor: "#858796",
          borderColor: '#dddfeb',
          borderWidth: 1,
          xPadding: 15,
          yPadding: 15,
          displayColors: false,
          caretPadding: 10,
        },
        legend: {
          display: false
        },
        cutoutPercentage: 75,
      },
    });
}

async function generate_assets_table() {
    // get data to array
    await getUserAssets();
    let table_data = user_assets;
    table_data = Object.assign([], table_data).reverse();

    // get the reference for the body
    let tbl = document.getElementById("assetTable");

    // create listener for list filter by coin type
    let coinTypeSelect = document.getElementById("type");
    coinTypeSelect.addEventListener("change", function updateAssetList() {
        let choosenType = document.getElementById("type").value;
        let tableRows = tbl.querySelectorAll('tr');
        // filter by type
        let rowCount = 1;
        tableRows.forEach(tr => {
            let rowAssetType = tr.getAttribute('value');

            if(rowAssetType === choosenType || rowAssetType === 'assetTableHead') {
                tr.hidden = false;
                if(rowAssetType === choosenType) {
                    tr.children[0].innerHTML = (rowCount).toString();
                    rowCount++;
                }
            }
            else {
                row.hidden = true;
            }

            tr.hidden = !(rowAssetType === choosenType || rowAssetType === 'assetTableHead');
        });
        // recalculate sum od assets
        let sum = 0;
        table_data.forEach(function(asset, i) {
            if (asset.type == choosenType) {
                sum = sum + asset.amount;
            }
        });
        document.getElementById('sumCell').innerHTML = sum;
    });

    // creates all table elements
    let tblHead = document.createElement("thead");
    let tblBody = document.createElement("tbody");

    //create header
    let headers = ['#', 'Amount', 'Price $', 'Date/ Time', 'Actions'];
    let headRow = document.createElement("tr");
        headRow.setAttribute('value', 'assetTableHead');
    headers.forEach(function(colHead, i) {
        let cell = document.createElement("th");
        let cellText = document.createTextNode(colHead);
        cell.appendChild(cellText);
        headRow.appendChild(cell);
    });
    tblHead.appendChild(headRow);

    // create the summary row
    let row = document.createElement("tr")
        row.setAttribute('value', 'assetTableHead');
    headers.forEach(function(colHead, i) {
        cell = document.createElement("td");
        switch(i) {
            case 0:
                cellText = document.createTextNode('Summed');
                break;
            case 1:
                cell.setAttribute('id', 'sumCell');
                let su = 0;
                table_data.forEach(function(asset, i) {
                    if (asset.type == 'btc') {
                        su = su + asset.amount;
                    }
                });
                cellText = document.createTextNode(su);
                break;
            case 3:
                cellText = document.createTextNode('Today');
                break;
            default:
                cellText = document.createTextNode('');
        }
        cell.appendChild(cellText);
        row.appendChild(cell);
    });
    tblBody.appendChild(row);

// creating table body cells
    let btcCount = 1;
    table_data.forEach(function (asset, i) { // asset is the key which is numeric and ordered from 0 up
      //create table rows
      row = document.createElement("tr");
      row.setAttribute('value', asset.type);
      row.setAttribute('id', asset.id);
      for (let j = 0; j < 5; j++) {
          cell = document.createElement("td");
          let text = "";
          switch (j) {
              case 1:
                text = asset.amount;
                var cellEntry = document.createTextNode(text);
                break;
              case 2:
                text = asset.price;
                var cellEntry = document.createTextNode(text);
                break;
              case 3:
                text = asset.date_added;
                var cellEntry = document.createTextNode(text);
                break;
              case 4:
                let delBtn = document.getElementById("assetDelBtn").cloneNode(true);
                delBtn.onclick = function() {deleteAsset(asset.id)};
                cellEntry = delBtn;
                break;
              default:
                text = "No value found!";
                var cellEntry = document.createTextNode(text);
          }
          cell.appendChild(cellEntry);
          row.appendChild(cell);
      }
      if(row.getAttribute('value') === document.getElementById("type").value) {
        row.hidden = false;
        row.children[0].innerHTML = (btcCount).toString();
        btcCount++;
      }
      else {
          row.hidden = true;
      }
      tblBody.appendChild(row)
    });

    // append header and body to table element
    tbl.appendChild(tblHead);
    tbl.appendChild(tblBody);
}


// onload start!!!
$(document).ready(function() {
    generate_coin_table();
    generate_assets_table();
});







