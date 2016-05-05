/**
 * NTS 네임스페이스
 * @namespace
 * @author hunyong.song
 * @since 2016.05.01
 */
var nts = window.nts || {
        model: {},
        view: {},
        controller: {},
        dao: {},
        observer: {},
        template: {}
    };

/**
 * 컨트롤러 생성자 정의
 * @param {Object} model 모델 객체
 * @param {Object} view 뷰 객체
 * @returns {*}
 * @constructor
 */
nts.controller = function (model, view) {
    var me = this;

    if (!(me instanceof nts.controller)) {
        return new nts.controller(model, view);
    }

    me._model = model;
    me._view = view;
    me._dao = new nts.dao(me._model);

    me._init();

    return me;
};

/**
 * 컨트롤러 객체의 프로토타입 정의
 */
nts.controller.prototype = {

    /**
     * 컨트롤러 최초 실행 함수
     * ajax로 local json을 호출
     * @private
     */
    _init: function () {
        this._bindViewEvents();
        this._bindModelEvents();

        this._dao.callData();
    },

    /**
     * view element에 이벤트를 바인드
     * @private
     */
    _bindViewEvents: function () {
        this._view._getMore.on('click', this._onClickChange.bind(this));
    },

    /**
     * 모델에 커스텀 이벤트를 바인드
     * @private
     */
    _bindModelEvents: function () {
        this._model.addEventListener('update', this._onUpdateModel.bind(this));
    },

    /**
     * 클릭 이벤트일 때 실행
     * @private
     */
    _onClickChange: function () {
        this._onUpdateModel();
    },

    /**
     * 모델 update일 때 실행
     * @private
     */
    _onUpdateModel: function () {
        this._view.render(this._model.localData);
    }
};

/**
 * DAO 생성자 정의
 * @returns {*}
 * @constructor
 */
nts.dao = function (model) {
    var me = this;

    if (!(me instanceof nts.dao)) {
        return new nts.dao();
    }

    me._model = model;
    me._method = 'GET';
    me._url = 'src/json/data.json';

    return me;
};

/**
 * DAO 객체의 프로토타입 정의
 */
nts.dao.prototype = {

    /**
     * ajax 통신 호출
     * @public
     */
    callData: function () {
        $.ajax({
                type: this._method,
                url: this._url,
                dataType: 'json',
                async: false
            })
            .done($.proxy(this._successHandler, this))
            .fail(this._failureHandler);
    },

    /**
     * ajax가 성공했을 때
     * @param {Object} data 받은 데이터
     * @private
     */
    _successHandler: function (data) {
        this._model.localData = data;
    },

    /**
     * ajax가 실패했을 때
     * @param {Object} err 에러 메세지
     * @returns {boolean}
     * @private
     */
    _failureHandler: function (err) {
        if (err) {
            window.alert('에러가 발생했습니다.');
            return false;
        }
    }
};

/**
 * 모델 생성자 정의
 * @returns {*}
 * @constructor
 */
nts.model = function () {
    var me = this;

    if (!(me instanceof nts.model)) {
        return new nts.model();
    }

    me._data = [];
    me._observer = new nts.observer();

    return me;
};

/**
 * 모델 객체의 프로토타입 정의
 */
nts.model.prototype = {

    /**
     * 데이터를 호출
     * @returns {Array}
     * @public
     */
    get localData() {
        return this._data;
    },

    /**
     * 데이터에 값을 저장
     * @param {Object} data dao 객체에서 보낸 데이터
     * @public
     */
    set localData(data) {
        this._data = data.items;
        this.dispatchEvent('update');
    },

    /**
     * 옵저버 객체에 커스텀 이벤트를 등록
     * @param {string} event 커스텀 이벤트 명
     * @param {function} callback 콜백 함수
     */
    addEventListener: function (event, callback) {
        this._observer.subscribe(event, callback);
    },

    /**
     * 옵저버 객체에 있는 커스텀 이벤트를 실행
     * @param {string} event 커스텀 이벤트 명
     */
    dispatchEvent: function (event) {
        this._observer.publish(event);
    }
};

/**
 * observer 생성자 정의
 * @returns {*}
 * @constructor
 */
nts.observer = function () {
    var me = this;

    if (!(me instanceof nts.observer)) {
        return new nts.observer();
    }

    me._eventHandler = $(this);

    return me;
};

/**
 * observer 객체의 프로토타입 정의
 */
nts.observer.prototype = {

    /**
     * 이벤트 핸들러에 커스텀 이벤트를 저장
     * @param {string} event 커스텀 이벤트 명
     * @param {function} callback 콜백 함수
     * @public
     */
    subscribe: function (event, callback) {
        this._eventHandler.on(event, callback);
    },

    /**
     * 이벤트 핸들러에 커스텀 이벤트를 삭제
     * @param {string} event 커스텀 이벤트 명
     * @public
     */
    unSubscribe: function (event) {
        this._eventHandler.off(event);
    },

    /**
     * 이벤트 핸들러에 저장되어있는 이벤트를 실행
     * @param {string} event 커스텀 이벤트 명
     * @public
     */
    publish: function (event) {
        this._eventHandler.trigger(event);
    }
};

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

/**
 * 뷰 생성자 정의
 * @returns {*}
 * @constructor
 */
nts.view = function () {
    var me = this;

    if (!(me instanceof nts.view)) {
        return new nts.view();
    }

    me._length = 15;
    me._observer = new nts.observer();
    me._init();

    return me;
};


/**
 * 뷰 객체의 프로토타입 정의
 */
nts.view.prototype = {

    /**
     * 뷰 최초 실행 함수
     * @private
     */
    _init: function () {
        this._insertTemplate();
        this._cacheElements();
    },

    /**
     * 뷰 최초 실행함수
     * 템플릿을 내부 변수에 캐시
     * @private
     */
    _insertTemplate: function () {
        this._listTemplate = nts.template.list;
        this._bottomTemplate = nts.template.bottom;
        this._bottomEndTemplate = nts.template.bottomEnd;
    },

    /**
     * 뷰 최초 실행함수
     * 더보기 element를 내부 변수에 캐시
     * @private
     */
    _cacheElements: function () {
        this._getMore = $('.cu_pg_w');
    },

    /**
     * 반복 출력될 리스트 낱개를 모아 frag에 저장하는 함수
     * @param {Array} data 데이터 배열
     * @returns {DocumentFragment} 렌더링 효율을 위해 frag에 저장
     * @private
     */
    _createFrag: function (data) {
        var frag = document.createDocumentFragment(),
            template, i, dataObj, length = this._length;

        for (i = length - 15; i < length; i += 1) {
            /**
             * @typedef {Object} dataObj
             * @property {string} thumb
             * @property {string} playTime
             * @property {string} category
             * @property {string} title
             */
            dataObj = data[i];

            template = this._listTemplate
                .replace(/\{\{thumb\}\}/g, dataObj.thumb)
                .replace(/\{\{playTime\}\}/g, dataObj.playTime)
                .replace(/\{\{category\}\}/g, dataObj.category)
                .replace(/\{\{title\}\}/g, dataObj.title);

            frag.appendChild($(template)[0]);
        }

        return frag;
    },

    /**
     * 리스트를 렌더링
     * @param {Array} data 데이터 배열
     * @private
     */
    _listRender: function (data) {
        var section = $('.jr_ct'),
            list;

        if (data.length < this._length) {
            return false;
        }

        list = this._createFrag(data);
        section.append(list);
    },

    /**
     * 화면 렌더가 끝난후 실행 함수
     * @private
     */
    _afterRender: function () {
        $('.u_pg_lodic').removeClass().addClass('ico_view');
        this._length += 15;
    },

    /**
     * '마지막 콘텐츠입니다' 렌더링
     * @private
     */
    _noticeFinishRender: function () {
        var template;

        template = this._bottomEndTemplate;
        this._getMore.html(template);
    },

    /**
     * 컨트롤러에서 걸어놓은 이벤트들 제거
     * @private
     */
    _removeEvents: function () {
        this._getMore.off('click');
        this._observer.unSubscribe('update');
    },

    /**
     * 더보기 버튼을 렌더링
     * @param {Array} data 데이터 배열
     * @private
     */
    _bottomRender: function (data) {
        var template;

        template = this._bottomTemplate
            .replace(/\{\{current\}\}/g, this._length.toString())
            .replace(/\{\{total\}\}/g, data.length.toString());

        this._getMore.html(template);
    },

    /**
     * 뷰 전체 렌더링
     * @param {Array} data 컨트롤러에서 받은 데이터
     * @public
     */
    render: function (data) {
        var me = this;

        if (data.length <= me._length) {
            me._noticeFinishRender();
            me._removeEvents();
        } else {
            me._bottomRender(data);
        }

        // 햇님 에니메이션을 위해 0.2초 딜레이
        setTimeout(function () {
            me._listRender(data);
            me._afterRender();
        }, 200);
    }
};
