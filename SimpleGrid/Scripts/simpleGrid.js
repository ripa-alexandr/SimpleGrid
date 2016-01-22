(function ($) {
    var settings = { page: 1, pageSize: 40 };

    $.fn.sortBy = function (columnName) {
        sortTable(this, columnName);
        goToPage(this, settings.page);

        return this;
    };

    $.fn.addPages = function (table, pageSize) {
        settings = $.extend(settings, { pageSize: pageSize });
        var pages = Math.ceil(table.find("tbody tr").length / settings.pageSize);
        var result = $("<ul class='pagination'></ul>");

        for (var i = 1; i <= pages; i++)
            result.append($("<li><a href='#'>" + i + "</a></li>"));

        this.append(result);
        goToPage(table, settings.page);
    };

    $.fn.goToPage = function (page) {
        goToPage(this, page);
    };

    $.fn.addRow = function (newRow) {
        var tableBody = this.find("tbody")[0];
        var tr = document.createElement("tr");
        for (var item in newRow) {
            var td = document.createElement("td");
            td.appendChild(document.createTextNode(newRow[item]));
            tr.appendChild(td);
        }
        tableBody.appendChild(tr);
        updatePagination(this);
    };

    var sortTable = function (table, columnName) {
        var column = getColumn(table, columnName);
        updateTableHead(table, column);

        var array = getArray(table);
        var sortArray = array.sort(compare(column));
        updateTableBody(sortArray, table, column);
    };

    var getArray = function (table) {
        var array = [];
        var headers = [];

        table.find("th").each(function (index, item) {
            headers[index] = item.innerText;
        });

        table.find("tr").has("td").each(function () {
            var arrayItem = {};
            $("td", $(this)).each(function (index, item) {
                arrayItem[headers[index]] = item.innerText;
            });
            array.push(arrayItem);
        });

        return array;
    };

    var getColumn = function (table, columnName) {
        var column;

        table.find("th").each(function (index, item) {
            if (item.innerText == columnName)
                column = item;
        });

        return column;
    }

    var compare = function (column) {
        var order = 1;

        if ($(column).hasClass("desc"))
            order = -1;

        return function (a, b) {
            var result = (a[column.innerText] < b[column.innerText]) ? -1 : (a[column.innerText] > b[column.innerText]) ? 1 : 0;

            return result * order;
        };
    };

    var updatePagination = function (table) {
        var pages = Math.ceil(table.find("tbody tr").length / settings.pageSize);
        var pagination = $(".pagination");
        var lastPage = pagination.find("li").last().text();

        if (lastPage < pages)
            pagination.append($("<li><a href='#'>" + pages.toString() + "</a></li>"));

        goToPage(table, settings.page);
    };

    var updateTableHead = function (table, column) {
        if ($(column).hasClass("asc")) {
            $(column).removeClass("asc");
            $(column).addClass("desc");
            return;
        }

        if ($(column).hasClass("desc")) {
            $(column).removeClass("desc");
            $(column).addClass("asc");
            return;
        }

        $(table).find("th").each(function (index, item) {
            if ($(item).hasClass("asc"))
                $(item).removeClass("asc");

            if ($(item).hasClass("desc"))
                $(item).removeClass("desc");
        });

        $(column).addClass("asc");
    }

    var updateTableBody = function (array, table) {
        var newTableBody = document.createElement("tbody");
        for (var i = 0; i < array.length; i++) {
            var tr = document.createElement("tr");
            for (var user in array[i]) {
                var td = document.createElement("td");
                td.appendChild(document.createTextNode(array[i][user]));
                tr.appendChild(td);
            }
            newTableBody.appendChild(tr);
        }
        table.find("tbody")[0].innerHTML = newTableBody.innerHTML;
    }

    var goToPage = function (table, page) {
        settings = $.extend(settings, { page: page });
        var skip = (settings.page - 1) * settings.pageSize;

        table.find("tbody tr").hide();
        table.find("tbody tr").slice(skip, skip + settings.pageSize).show();

        selectPage(page);
    };

    var selectPage = function (page) {
        $(".pagination li.active").removeClass("active");
        $(".pagination li:contains('" + page + "')").addClass("active");
    };
})(jQuery)

