// global shared data
let coin_data;
let user_assets;
let currency_total_values;

function getCoinData() {
    return axios.get('/dataload', { crossdomain: true })
        .then(res => {
            coin_data = res.data.data;
        })
        .catch(err => console.error(err));
}

function getUserAssets() {
    return axios.get('/assetload_by_user', { crossdomain: true })
        .then(res => {
            user_assets = Object.assign([], res.data);
        })
        .catch(err => console.error(err));

}

function generate_coin_table() {
    // get data
  let table_data = coin_data;

  // get the reference for the body
  let tbl = document.getElementById("dataTable");

  // creates all table elements
  let tblHead = document.createElement("thead");
  let tblFoot = document.createElement("tfoot");
  let tblBody = document.createElement("tbody");
  //create header and footer
  let headers = ['#', 'Name', 'Price $', 'Change(24h)', 'Change(7d)', 'In Portfolio', 'Value', 'Market-Cap.', 'Circulation-Supply', 'Volume.(24h)']
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
      for (let j = 0; j < 10; j++) {
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
                if(currency_total_values[(table_data[coin].symbol).toLowerCase()]) {
                    text = (currency_total_values[(table_data[coin].symbol).toLowerCase()].amount).toString();
                } else {
                    text = '0';
                }
                break;
              case 6:
                if(currency_total_values[(table_data[coin].symbol).toLowerCase()]) {
                    text = convertNumberStr(currency_total_values[(table_data[coin].symbol).toLowerCase()].value * currency_total_values[(table_data[coin].symbol).toLowerCase()].amount);
                } else {
                    text = '0';
                }
                break;
              case 7:
                text = convertNumberStr(table_data[coin].quote.USD.market_cap);
                break;
              case 8:
                text = convertNumberStr(table_data[coin].circulating_supply);
                break;
              case 9:
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

async function deleteAsset(assetId) {
    await axios.post('/asset/delete', {assetId})
        .then(res => {
            // update asset sum
            let sumCell = document.getElementById('sumCell');
            let assetRow = document.getElementById(assetId);
            sumCell.innerHTML = (parseFloat(sumCell.innerHTML) - parseFloat(assetRow.children[1].innerHTML)).toString();
            assetRow.parentNode.removeChild(assetRow);
        })
        .catch(err => console.error(err));
    // get data
    await getUserAssets();
    await getCoinData();
    await calcAssetTotalValues();
    // create widgets
    generate_coin_table();
    createPortfolioPieChart();
}

function createPortfolioPieChart() {
    // Set new default font family and font color to mimic Bootstrap's default styling
    Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
    Chart.defaults.global.defaultFontColor = '#858796';

    let labels = Object.keys(currency_total_values);
    let valuePercent = [];
    let portfolioVal = 0;
    for(let type in currency_total_values) {
        portfolioVal = portfolioVal + (currency_total_values[type].amount * currency_total_values[type].value);
    }
    for(let type in currency_total_values) {
        valuePercent.push((currency_total_values[type].amount * currency_total_values[type].value) / (portfolioVal/100));
    }
    let ctx = document.getElementById("portfolioPieChart");
    let portfolioPieChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: valuePercent,
          backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#EBB427', '#D03627', '#9933ff'],
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
          display: true,
          position: 'bottom',
          align: 'center',
          labels: {
              boxWidth: 12,
          }
        },
        cutoutPercentage: 70,
      },
    });

}

function generate_assets_table() {
    // get data to array
    let table_data = user_assets;
    table_data = table_data.reverse();

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
    let headers = ['#', 'Amount', 'Buying price ($)', 'Date/ Time', 'Actions'];
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
                delBtn.removeAttribute('hidden');
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

function groupBy(array, property) {
    const groupBy = key => array =>
      array.reduce((objectsByKeyValue, obj) => {
        const value = obj[key];
        objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
        return objectsByKeyValue;
      }, {});

    const groupByProperty = groupBy(property);
    return groupByProperty(array)
}

function calcAssetTotalValues() {
    let groupedAssetArray = groupBy(user_assets, "type");
    let prototype = new Object();
    for (let assetType in groupedAssetArray) {
        let sum = 0;
        let value = 0;
        for (let asset of groupedAssetArray[assetType]) {
            sum = sum + asset.amount;
            for (let coin in coin_data) {
                if(coin_data[coin].symbol.toLowerCase() == assetType) {
                    value = coin_data[coin].quote.USD.price;
                }
            }
        }
        prototype[assetType] = {amount: sum, value: value};
    }
    currency_total_values = prototype;
}

async function refresh() {
    // get data
    await getUserAssets();
    await getCoinData();
    await calcAssetTotalValues();
    // create widgets
    generate_assets_table();
    generate_coin_table();
    createPortfolioPieChart();
}

// onload start!!!
$(document).ready(async function() {
    // get data
    await getUserAssets();
    await getCoinData();
    await calcAssetTotalValues();
    // create widgets
    generate_assets_table();
    generate_coin_table();
    createPortfolioPieChart();
});







