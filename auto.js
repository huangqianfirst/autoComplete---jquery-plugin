$(function() {

    var matchD = [{
        "match": ["shanghai", "上海", "sh"],
        "name": "上海",
        "val": "上海名"
    }, {
        "match": ["suzhou", "苏州", "sz"],
        "name": "苏州",
        "val": "苏州名"
    }, {
        "match": ["nanchang", "南昌", "nc"],
        "name": "南昌",
        "val": "南昌名"
    }, {
        "match": ["nanning", "南宁", "nn"],
        "name": "南宁",
        "val": "南宁名"
    }];
//让光标位于输入处
    document.getElementById('leaveCityInput').focus();
    $("#leaveCityInput").autoComplete({
        //        localData: matchD,
        highlight: true,
        width: 220,
        max: 10,
        getValue: getValue,
        itemPrintFn: itemPrintFn,
        clearUl: clearUl,
        ajaxObj: {
            url: 'asynData.json',
            dataType: 'json',
            success: function(data) {

                //            console.log('data',data.asyn[0]);
                var match = data.asyn,
                    len = match.length;
                var index = [];
                $('#leaveCityInput')[0].oninput = function() {
                    clearUl();
                    index = [];
                    var setValue = [];
                    var inputValue = $(this).val();
                    console.log(inputValue);
                    if (inputValue != '') {
                        for (var i = 0; i < len; i++) {

                            var str = match[i].match;
                            var indexStrArray = str.map(function(single) {
                              return single.indexOf(inputValue)==-1 ? 99999: single.indexOf(inputValue);
                            });
                            var minIndex = Math.min.apply(null, indexStrArray);
                            
                            if (minIndex != 99999) {
                                index.push({
                                    index: i,
                                    value: minIndex
                                });

                                //                                console.log(index);
                            }
                        }
                    }
                    //先对匹配出的item,按照关键字索引的前后顺序进行排序（按index对象的属性值排序）
                    index.sort(function(a, b) {

                        if (a.value < b.value)
                            return -1;
                        if (a.value > b.value)
                            return 1;
                        return 0;

                    });
                    
                    for (var j = 0; j < index.length; j++) {
                        itemPrintFn(match[index[j].index]);
//                        setValue.push(match[index[j]]);
                    }
                    getValue();
                }
            }
        }
    });
    //异步

    //将匹配的字符串show在input的下方
    function itemPrintFn(data) {
        console.log('exect');
        $('ul').css('display', '');
        $('ul').append('<li>' + data.name + '</li>');
    };

    function clearUl() {
        $('ul').empty();
    }
    //选中一条时的值
    function getValue() {
        $('ul').delegate('li', 'click', function() {
            var elem = $(this);
            console.log(typeof elem.text());
            $('#leaveCityInput').val(elem.text());
            clearUl();
        });
    }
});
$.fn.extend({
    autoComplete: function(obj) {
        if (obj.localData) {
            var match = obj.localData,
                len = match.length;
            var index = [];
            $(this)[0].oninput = function() {
                obj.clearUl();
                index = [];
                var setValue = [];
                var inputValue = $(this).val();
                console.log(inputValue);
                if (inputValue != '') {
                    for (var i = 0; i < len; i++) {
                        var str = match[i].match.join('');
                        var indexStr = str.indexOf(inputValue);
                        if (indexStr != -1) {
                            index.push(i);

                            console.log(index);
                        }
                    }
                }
                for (var j = 0; j < index.length; j++) {
                    obj.itemPrintFn(obj.localData[index[j]]);
                    setValue.push(obj.localData[index[j]]);
                }
                obj.getValue(setValue);
                //            obj.clearUl();
            }
        } else if (obj.ajaxObj) {
            //            console.log('data');
            $.ajax({
                url: obj.ajaxObj.url,
                dataType: obj.ajaxObj.dataType,
                success: function(data) {
                    //                    console.log(data);
                    obj.ajaxObj.success(data);
                },
                error: function() {
                   
                }
            });
        }


    }
});