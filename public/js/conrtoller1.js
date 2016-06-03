/**
 * Created by asargsyan on 3/16/16.
 */

var demo = angular.module('demo', ['elasticjs.service', 'ngSanitize', 'infinite-scroll', 'angularUtils.directives.dirPagination']);


demo.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
}
]);
//demo.filter('highlight', function($sce) {
//    return function (text, phrase) {
//        if (phrase) text = text.replace(new RegExp('(' + phrase + ')', 'gi'),
//            '<span class="highlighted">$1</span>')
//
//        return $sce.trustAsHtml(text)
//    }
//});
//demo.filter('newlines', function ($ce) {
//    return function(text) {
//        if(text)
//            return text.replace(/\n/g, '<br/>');
//        return '';
//    }
//})
//demo.directive("bindCompiledHtml", function($compile, $timeout) {
//    return {
//        template: '<div></div>',
//        scope: {
//            rawHtml: '=bindCompiledHtml'
//        },
//        link: function(scope, elem, attrs) {
//            scope.$watch('rawHtml', function(value) {
//                if (!value) return;
//
//                var newElem = $compile(value)(scope.$parent);
//                elem.contents().remove();
//                elem.append(newElem);
//            });
//        }
//    };
//});

demo.controller('SearchCtrl', function ($scope, ejsResource,$sce,  $http) {


    var ejs = ejsResource('http://192.168.20.109:9200');
    $scope.itemsPerPage = 3;
    $scope.pageNumber;
    $scope.queryTerm;

     $scope.size=function(size){
      $scope.totalItems = size.length;
    }
    $scope.search = function (pageno, querytext) {
        if(pageno===undefined) { $scope.pageNumber=1;}
        else{$scope.pageNumber=pageno;}


        $scope.queryTerm="";
        $scope.fromPageNumber;
        $scope.queryTerm = querytext;
        if ($scope.queryTerm != "" && $scope.queryTerm != null && $scope.queryTerm != undefined) {

            //var oQuery = ejs.QueryStringQuery().defaultField('content');
            $scope.fromPageNumber = (($scope.pageNumber * $scope.itemsPerPage) - ($scope.itemsPerPage));
            console.log(    $scope.fromPageNumber);

            var highlightPost = ejs.Highlight(["content"])
                .fragmentSize(800, "content")
                .numberOfFragments(1, "content")
                .preTags("<b>", "content")
                .postTags("</b>", "content");

            var client = ejs.Request()
                .indices('ts')
                .types('ts')
                //.highlight(highlightPost)
            //.fields([ 'content'])
            //.sort('_id')
            .from( $scope.fromPageNumber)
            .size($scope.itemsPerPage);
            //$scope.queryTerm = querytext;
            console.log(client);
            //$scope.results = client
            //    .query(oQuery.query($scope.queryTerm || '*'))
            //    //.fields(['fileName', 'content','date'])
            //    .doSearch();
///first  example
//            $scope.results2 = client
//                .query(ejs.MatchQuery('_all', $scope.queryTerm))
//               .fields([ 'content', 'fileName','fullPath'])
//                .highlight(highlightPost)
//                .doSearch();
            $scope.results2 = client
                .query(ejs.MatchQuery('content', $scope.queryTerm))
               .fields([ 'content', 'fileName','fullPath'])
                .highlight(highlightPost)
                .doSearch();
            console.log($scope.results2);
            var clienttt = ejs.Request()
                .indices('ts')
                .types('ts')
                .highlight(highlightPost);
            $scope.result = clienttt
                .query(ejs.MatchQuery('content', $scope.queryTerm))
                //.fields(['fileName', 'content', 'date'])
                .doSearch();
            //console.log($scope.results2);


        } ;

        var textNewArr=[];
        $scope.textSplit=function(text, lenght) {
            if (lenght != 1) {
                var i=-1;
                textNewArr.push(text.split("<b>"+$scope.qTemp[lenght]+"</b>"));
                return    $scope.textSplit(textNewArr[i+1], lenght - 1);

            } else {
                return textNewArr[lenght]=text.split("<b>"+$scope.qTemp[lenght]+"</b>");
            }
        }
        $scope.myHTML=[];
        $scope.content = function (cont ) {
           $scope.textTemp=[];
            $scope.qTemp = [];
            $scope.text="";
            $scope.textTemp = "";

            if (cont != undefined) {
                $scope.text=cont;
                if ($scope.queryTerm.indexOf("(") >= 0 && $scope.queryTerm.indexOf(")") >= 0) {
                    //$scope.qTemp.push($scope.queryTerm.replace(/\(|\)/g, "")) }
                $scope.qTemp.push($scope.queryTerm); }
                else  if ($scope.queryTerm.indexOf(" ") > 0) {
                    $scope.qTemp = $scope.queryTerm.split(" ");
                }
                else {
                    $scope.qTemp.push($scope.queryTerm.replace(/\(|\)/g, ""));
                                    }
               var l = $scope.qTemp.length;

                for ( var j = 0;  j < l; j++) {
                    var replacement="<b>"+$scope.qTemp[j]+"</b>";
                    if(j===0  ){
                        $scope.text=$scope.text.replace(new RegExp($scope.qTemp[j], 'g'), replacement);
                    }
                    else {
                           if($scope.qTemp[j]!="b" && $scope.qTemp[j]!="<" && $scope.qTemp[j]!="<" && $scope.qTemp[j]!="/"){
                               $scope.text=$scope.text.replace(new RegExp($scope.qTemp[j], 'g'), replacement);
                                }   else{

                                    for ( var k = 0;  k < j;k++) {
                                        $scope.index=0;
                                        $scope.text=$scope.text.replace(new RegExp("<b>" + $scope.qTemp[k] + "</b>", 'g'), ("#"+$scope.index));
                                        $scope.index++;
                                    }
                                    $scope.text=$scope.text.replace(new RegExp($scope.qTemp[j], 'g'), replacement);
                                    for ( var k = 0;  k <=  $scope.index;k++) {
                                        var forbold="#"+k;
                                        var  finishreplacment="<b>" + $scope.qTemp[k] + "</b>";
                                        $scope.text=$scope.text.replace(new RegExp(forbold, 'g'), finishreplacment);
                                    }
                           }
                    }
                }
            }

            if ($scope.text != '' && $scope.text != " " && $scope.text != null && $scope.text != undefined) {
                $scope.arayText=[];
                $scope.textTemp= $scope.text;
                $scope.arayText = $scope.text.split(" ");
                $scope.text="";
                var leng = $scope.arayText.length;
                var arr=[];
              for (var boldIn = 0; boldIn < leng; boldIn++) {

                     for(var i=0;i<l;i++){
                         var serchString= "<b>"+$scope.qTemp[i]+"</b>";
                         var a=$scope.arayText[boldIn].indexOf(serchString);
                        if($scope.arayText[boldIn].indexOf(serchString)>=0)
                        {
                         arr.push(boldIn); break; }
                     }
              }
                $scope.text += " ";
                for(var i=0;i<arr.length;i++){
                    if(arr.length===1){
                        for(var j=20;j>=0;j--){
                          if(arr[i]-j>=0){
                                $scope.text += $scope.arayText[arr[i]-j];
                                $scope.text += " ";
                          }
                        }
                        for(var j=1;j<20;j++){
                                 $scope.text += " ";
                            $scope.text += $scope.arayText[arr.length+j];}
                    }
                    else{
                         if ((i - 1) === arr.length) {
                             for(var j=1;j<4;j++){
                                 $scope.text += " "; $scope.text += $scope.arayText[arr.length+j];}
                         }
                         else {
                             if(arr[i]<4){
                                 $scope.text += $scope.arayText[arr[i]];
                                 $scope.text += " ";
                             }
                             else{
                                for(var j=4;j>1;j--){
                                    if(arr[i-1]<arr[i]-j){
                                    $scope.text += $scope.arayText[arr[i]-j];
                                    $scope.text += " ";
                                     }
                                    else{ $scope.text += $scope.arayText[arr[i]];
                                    $scope.text += " ";break;}
                                }
                             }
                         }
                    }
                }
                if($scope.text===" ")
                {$scope.text=$scope.textTemp;}

                //console.log($scope.text);
                var firstIndex=0;
                $scope.letterLimit = 600;
                if($scope.text.indexOf(replacement)>$scope.letterLimit){
                    $scope.letterLimit=$scope.text.indexOf(replacement)+200;firstIndex=$scope.text.indexOf(replacement)-200
                }
                $scope.text=$scope.text.slice(firstIndex,$scope.text.indexOf(" ", ($scope.letterLimit)));
                 $scope.myHTML.push($scope.text);
                     }
        }
    }

    //if ($scope.textTemp != "") {
                    //    $scope.text = $scope.textTemp;
                    //    $scope.textTemp = "";
                    //}
                    //    if ($scope.text.indexOf($scope.qTemp[j]) > 0) {
                    //        $scope.arayText = [];
                    //        $scope.arayText = $scope.text.split($scope.qTemp[j]);
                    //
                    //        var len = $scope.arayText.length;
                    //
                    //            for (var i = 0;  i < len; i++) {
                    //                if ((len - 1) === i) {
                    //                    $scope.textTemp += $scope.arayText[i];
                    //                } else {
                    //                    $scope.textTemp += $scope.arayText[i];
                    //                    $scope.textTemp += $scope.qTemp[j].bold();
                    //                }
                    //            }
                    //    } else { $scope.textTemp = $scope.text;    }

                    //var replacement2=  '<span class="highlighted">>$1</span>'
                    //
                    //$scope.text=  $scope.text.replace(RegExp('('+ $scope.qTemp[j] + ')', 'g'), replacement2);


                        //if($scope.qTemp[j]!="b" && $scope.qTemp[j]!="<" && $scope.qTemp[j]!="<" && $scope.qTemp[j]!="/"){
                        //    $scope.text=$scope.text.replace(new RegExp($scope.qTemp[j], 'g'), replacement);
                        //}
                        //else {
                        //    $scope.boldtext=[];
                        //    $scope.boldtext.push( $scope.replaceBold( $scope.text),j)
                        //
                        //    //var tempAray = [];
                        //    //
                        //    //for (var t = 0; t < j+1; t++) {
                        //    //    tempAray.push($scope.text);
                        //    //    $scope.text = "";
                        //    //    $scope.arayText=[];
                        //    //    $scope.arayText = tempAray[t].split("<b>" + $scope.qTemp[t] + "</b>");
                        //    //    var leng = $scope.arayText.length;
                        //    //    for (var boldIndex = 0; boldIndex < leng; boldIndex++) {
                        //    //        if ((leng - 1) === boldIndex) {
                        //    //
                        //    //            $scope.text += $scope.arayText[boldIndex].replace(new RegExp($scope.qTemp[j], 'g'), replacement);
                        //    //        }
                        //    //        else {
                        //    //            $scope.text += $scope.arayText2[boldIndex].replace(new RegExp($scope.qTemp[j], 'g'), replacement);
                        //    //            ;
                        //    //            $scope.text += "<b>" + $scope.qTemp[t] + "</b>";
                        //    //
                        //    //        }
                        //    //    }
                        //    //
                        //    //
                        //    //    tempAray.push($scope.text);
                        //    //
                        //    //}
                        //    //
                        //}



                   ////////////////







                //$scope.text = $scope.textTemp;

                //$scope.arayText = $scope.text.split("</b>");var leng = $scope.arayText.length;
                //$scope.text = "";

                    //for (var boldIndex = 0; boldIndex < leng; boldIndex++) {
                    //
                    //
                    //
                    //
                    //
                    //           //var tex = $scope.arayText[boldIndex];
                    //           $scope.arayText2 = [];
                    //           $scope.arayText2 = $scope.arayText[boldIndex].split("<b>");
                    //           var index = $scope.arayText2[0].indexOf(" ", $scope.wordLimit);
                    //           if (index > 0) { var arrNewText = $scope.arayText2[0].substring(0, $scope.arayText2[0].indexOf(" ", $scope.wordLimit) + 1);   }
                    //           else { var arrNewText = $scope.arayText2[0]; }
                    //
                    //           if ((leng - 1) === boldIndex) {
                    //               if (index > 0) {
                    //                 arrNewText += $scope.arayText[boldIndex].substring(0, $scope.arayText[boldIndex].indexOf(" ",$scope.wordLimit) + 1);
                    //               }
                    //               $scope.text += arrNewText;
                    //
                    //           }
                    //           else {
                    //               arrNewText += "<b>";
                    //               arrNewText += $scope.arayText2[1];
                    //               $scope.text += arrNewText;
                    //               $scope.text += "</b>"
                    //           }
                    //}


//var textOriginal = "", textDiv = null;
    //$scope.aaa=[];
    //$scope.findText=function(){
    //    var string = prompt("Введите символ для поиска",""), text = "";
    //
    //    if(string === undefined || string === null || string === "") return;
    //
    //
    //    $scope.aaa=cont.split($scope.queryTerm),i = 0, len = $scope.aaa.length - 1;
    //
    //    for(; i < len; i++){
    //        $scope.text += $scope.aaa[i];
    //        $scope.text +=  string.bold ;
    //    }
    //    $scope.text += arr[i];
    //
    //    var arr = textOriginal.split(string), i = 0, len = arr.length - 1;
    //
    //    for(; i < len; i++){
    //        text += arr[i];
    //        text += "<span style='color:red; font-weight:bold'>" + string + "</span>";
    //    }
    //
    //    text += arr[i];
    //    $scope.myHTML = result;
    //}
    //
    //$scope.clear=function() {
    //    $scope.myHTML = textOriginal;
    //}
    //
    //window.onload = function() {
    //    textDiv = document.getElementById("text");
    //    textOriginal =  $scope.myHTML;
    //}

    //



//    //$http.post('/postUrlHere',{}).success(function (response) {
//    //    var file = new Blob([response], {type: 'application/pdf'});
//    //    var fileURL = URL.createObjectURL('/home/asargsyan/Downloads/Spring4MVCAngularJSExample/src/main/resources/TS_516-1601033_Ex.pdf');
//    //    $scope.content = fileURL;
//    //});
//
//
//    //$scope.pdfUrl ="/static/js/pdf/TS_516-1601033_Ex.pdf";
//    $scope.pdfUrl = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/149125/relativity.pdf';
//
//


//    //$scope.pageNumber=  $scope.firstpageNumber;
//        //var activeFilters = {};
//
//
//        //var statusRequest = ejs.Request()
//        //    .indices('myindex')
//        //    .types('tweet')
//        //    .sort('_id')
//        //    .from($scope.pageNumber)
//        //    .size($scope.itemsPerPage)
//        //    .facet(
//        //    ejs.TermsFacet('tags')
//        //        .field('Tags')
//        //        .size(10));
//    console.log($scope.pageNumber)
//            $scope.letterLimit =1400;
//        $scope.pageNumber=1;
//        $scope.queryTerm= "TS_737-1600235_Smart_Card_A.pdf";
//        //$scope.resultsArr = [];
//        $scope.resultsArr2=[];
//        $scope.myData=[];
//        $scope.itemsPerPage = 2;
//        $scope.total_count = 0;
//    console.log($scope.pageNumber)
//
//
//    $scope.search = function(pageno) {
//        //pageNumber=pageno;
//
//        $scope.fromPageNumber=((pageno*$scope.itemsPerPage)-$scope.itemsPerPage);
//        $scope.pageNumber = pageno;
//        client = ejs.Request()
//            .indices('ts')
//            .types('ts')
//            .sort('_id')
//            .from( $scope.fromPageNumber)
//            .size($scope.itemsPerPage);
//
//        $scope.resultsArr2 = [];
//        var results2 = client
//            .query(ejs.MatchQuery('_all', $scope.queryTerm))
//            .fields(['fileName', 'content','date'])
//            .doSearch();
////$scope.aaa=results2.hits.hits;
//        $scope.resultsArr2.push(results2);
//        console.log( $scope.resultsArr2);
//        //console.log($scope.fromPageNumber);
//        //console.log("PageNumber");
//        //console.log($scope.pageNumber);
//        //console.log("pageno");
//        //console.log(pageno)
//
//        //var results1 = statusRequest
//        //      .query(ejs.MatchQuery('_all', $scope.queryTerm))
//        //      .fields(['user','title', 'body','postDate'])
//        //     //.fields(['content','tags','title', 'published_at'])
//        //      .doSearch();
//        //var results1 = client
//        //      .query(QueryObj.query($scope.queryTerm || '*'))
//        //      //.query(applyFilters(QueryObj.query($scope.queryTerm || '*')))
//        //      .doSearch();
//
//
//        //$scope.resultsArr.push(results1);
//    };
//
//
//    $scope.search($scope.pageNumber);


    //var pageno=1;
    //var results2 = client
    //    .query(ejs.MatchQuery('_all', $scope.queryTerm))
    //    .fields(['user','title', 'body','postDate'])
    //    .doSearch();
    //$scope.myData.push(results2);
    //$scope.datalist = function() {


    //
    //var results2 = client
    //    .query(ejs.MatchQuery('_all', $scope.queryTerm))
    //    .fields(['user','title', 'body','postDate'])
    //    .doSearch();
    //
    //
    //console.log("first data");  console.log(results2);
    //
    //$scope.resultsArr2.push(results2);

    //return $http.post('./list', {pagenumber: $scope.newPageNumber, itemsPerPage: $scope.itemsPerPage})
    //    .success(function (data, status, headers, config) {
    //        $scope.myData = data.data;
    //        //$scope.total_count = response.total_count;
    //    })

    //}

    //    $scope.data=[{
    //    name:"art",
    //    surname:"sar",
    //    date:"14.02.2016"
    //},
    //    {
    //        name:"Sr",
    //        surname:"Apt",
    //        date:"13.03.2016"},
    //        {
    //            name:"GAr",
    //            surname:"Apt",
    //            date:"13.03.2016"},
    //        {
    //            name:"VAr",
    //            surname:"Apt",
    //            date:"13.03.2016"}]
    //


    //
    //$scope.isActive = function (field, term) {
    //    return activeFilters.hasOwnProperty(field + term);
    //};
    //
    //var applyFilters = function(query) {
    //
    //    var filter = null;
    //    var filters = Object.keys(activeFilters).map(function(k) { return activeFilters[k]; });
    //
    //    if (filters.length > 1) {
    //        filter = ejs.AndFilter(filters);
    //    } else if (filters.length === 1) {
    //        filter = filters[0];
    //    }
    //
    //    return filter ? ejs.FilteredQuery(query, filter) : query;
    //};


    //console.log( $scope.results);
    //$scope.filter = function(field, term) {
    //    if ($scope.isActive(field, term)) {
    //        delete activeFilters[field + term];
    //    } else {
    //        activeFilters[field + term] = ejs.TermFilter(field, term);
    //    }
    //    $scope.search();
    //}

    //console.log($scope.pageNumber)
});