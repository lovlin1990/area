# area
1.用法引入js
<!-- json放到 area-pc.js 之前-->
<script src="area.json"></script>
<script src="js/area-pc.js"></script>
2.html
<div class="area-pc-div">
    <div class="area-pc" data-inputName="aa" data-default='[{"name":"北京","code":"c010000-c010100","type":"hot"},{"name":"江浙沪","code":"p000002","type":"slices"},{"name":"河南-洛阳市","code":"c070000-c070300","type":"pc"}]'></div>
</div>


* 省市联动多选
* area.json放到 area-pc.js 之前引入
* data-inputName表示隐藏的input框的name值
* data-default表示默认数据，以object数组形式展现[{"type":"hot","code":"3","name":"天津"},{"type":"slices","code":"2","name":"江浙沪"}]
* area_hot热门城市初始化
* area_slices区域初始化
* addAreaBox加载模板


![pic1](https://github.com/lovlin1990/area/blob/master/intro/area.png);
