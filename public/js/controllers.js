// <div class="row row-offcanvas row-offcanvas-right">
// 	<div class="col-xs-12 col-sm-8">
// 		<p class="pull-right visible-xs">
// 			<button type="button" class="btn btn-primary btn-xs" data-toggle="offcanvas">Toggle nav</button>
// 		</p>
// 		<div class="jumbotron text-center">
// 			<h1>Easy Rate App</h1>
// 			<p>bla-bla-blaaa</p>
// 		</div>
//
//
//
//
// 				<table class="table" >
// 					<thead>
// 					<tr>
// 						<th>ID</th>
// 						<th>Name</th>
// 						<th>Discription</th>
// 						<th>Short_Text</th>
// 						<th>Raiting</th>
// 					</tr>
// 					</thead>
// 					<tbody ng-repeat="product in getProductList  ">
// 					<tr>
// 						<td>{{product.ID}}{{product.PRODUCT_ID}}</td>
// 						<td>{{product.NAME}}</td>
// 						<td>{{product.DESCRIPTION}}</td>
// 						<td>{{product.SHORT_TEXT}}</td>
// 						<td><div ng-init="rating = product.STATUS"></div>
//
// 							<img width="75px" height="100px" ng-src="{{product.RESOURCE}} " alt="{{product.NAME}}"/>
// 							<p><a class="btn btn-default" href="#/phones/{{product.PRODUCT_ID}}" role="button">View details &raquo;</a></p>
//
// 							<div class="star-rating" star-rating rating-value="rating" data-max="5" on-rating-selected="rateFunction(rating)"></div></td>
// 					</tr>
//
// 					</tbody>
// 				</table>
//
// 					{{product.status }}
//
//
// 					<!--<img ng-src="{{phone.imageUrl}}" alt="{{product.NAME}}"/>-->
//
//
//
//
// 			<div class="col-xs-12 col-sm-6 col-lg-4 item" ng-repeat="phone in phones | filter: search">
// 				<div class="preview-img text-center">
//
// 					<img ng-src="{{phone.imageUrl}}" alt="{{phone.name}}"/>
//             <span class="label"
// 									ng-init="status = phone.status ? 'Есть в наличии' : 'Под заказ'"
// 									ng-class="{'label-success':phone.status, 'label-warning': !phone.status}">
//               {{status}}
//             </span>
// 				</div>
// <!--Raiting-->
// 			 <div ng-init="rating = phone.rating"></div>
// 			 <div class="star-rating" star-rating rating-value="rating" data-max="5" on-rating-selected="rateFunction(rating)"></div>
//
// 				<h2>{{phone.name}}</h2>
// 				<p>{{phone.snippet}}</p>
// 				<p><a class="btn btn-default" href="#/phones/{{phone.id}}" role="button">View details &raquo;</a></p>
// 			</div><!--/.col-sm-6.col-lg-4-->
// 		</div>
//
//
//
// 	</div><!--/.col-xs-12.col-sm-8-->
//
//
// 	<div class="col-xs-6 col-sm-4 sidebar-offcanvas" id="sidebar">
// 		<h3 class="text-center">Фильтр телефонов</h3>
// 		<div class="list-group">
// 			<div class="list-group-item text-center">
// 				<form>
// 					<input type="text" class="form-control" placeholder="Search..." ng-model="search">
// 				</form>
// 							</div>
//
// 			<div ng-controller="ElasticSeachCtrl">
//
//
//
// 				<div class="container">
// 					<div class="row" id="login-container">
// 						<div class="span8 offset4">
//
// 							<input type="text" ng-model="queryTerm" placeholder="What are you looking for?"
// 								   class="input-large" ng-change="search()">
// 						</div>
// 					</div>
// 				</div>
//
// 				<div class="row-fluid" infinite-scroll="show_more()">
// 					<div class="span9">
// 						<table class="table table-striped table-bordered table-hover">
// 							<tbody >
// 							<tr ng-repeat="doc in results.$$state.value.hits.hits">
// 								<td><h1>{{doc.fields.title[0] }}</h1>
// 									{{doc.highlight.content[0] }}
// 									<!--<img src="{{ doc._source.user.profile_image_url }}">-->
// 								</td>
// 								<td>
// 									<div ng-bind-html="renderResult(doc)"></div>
// 									<small ng-bind-html="renderResultMetadata(doc)"></small>
// 								</td>
// 							</tr>
// 							</tbody>
// 						</table>
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	</div><!--/.sidebar-offcanvas-->
// </div><!--/row-->
//                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   