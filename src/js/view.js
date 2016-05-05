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
