/**
 * 리스트에 출력될 템플릿
 * @type {string}
 */
nts.template.list =
    '<div class="card_wrap">' +
    '<div class="card type_basic">' +
    '<a href="#">' +
    '<span class="img_wrap">' +
    '<span class="inner"><img src="{{thumb}}" alt=""></span>' +
    '<span class="time"><span>{{playTime}}</span></span>' +
    '</span>' +
    '<span class="icon">따끈따끈</span>' +
    '<h3 class="title"><span class="menu">{{category}}</span>{{title}}</h3>' +
    '</a>' +
    '<div class="u_likeit_list_module">' +
    '<a href="#" class="u_likeit_list_btn u_type_bright u_none_txt">' +
    '<span class="u_ico"></span><em class="u_txt">좋아요</em><em class="u_cnt">0</em>' +
    '</a>' +
    '</div>' +
    '</div>' +
    '</div>';

/**
 * 더보기에 출력될 템플릿
 * @type {string}
 */
nts.template.bottom =
    '<a href="javascript:void(1);" class="cu_pg_btn">' +
    '<span class="cu_pg_wrap">' +
    '<span class="cu_pg_area">' +
    '<span class="u_pg_lodic"></span>' +
    '<span class="cu_pg_txt">' +
    '더보기 <span class="cu_pg_cnt">{{current}}/{{total}}</span>' +
    '</span>' +
    '</span>' +
    '</span>' +
    '</a>';

/**
 * 더보기가 끝났을 때 출력될 템플릿
 * @type {string}
 */
nts.template.bottomEnd =
    '<p class="notice_end_ct">마지막 콘텐츠입니다.</p>';
