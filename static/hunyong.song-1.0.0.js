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
        helper: {},
    };

/**
 * DAO 생성자 정의
 * @returns {*}
 * @constructor
 */
nts.model.BaseDao = function () {

};

/**
 * DAO 객체의 프로토타입 정의
 */
nts.model.BaseDao.prototype = {

    /**
     * ajax 통신 호출
     * @public
     */
    request: function (url) {
        return $.ajax({
                type: 'GET',
                url: url,
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
        return data;
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
 * DAO 생성자 정의
 * @extends nts.model.BaseDao
 * @returns {*}
 * @constructor
 */
nts.model.AutoScrollDao = function (model) {
    // 부모 DAO의 생성자를 상속
    nts.model.BaseDao.call(this);
    this._model = model;
};

/**
 * 부모 DAO의 프로토타입을 상속
 * @type {nts.model.BaseDao}
 */
nts.model.AutoScrollDao.prototype = Object.create(nts.model.BaseDao.prototype);
nts.model.AutoScrollDao.prototype.constructor = nts.model.AutoScrollDao;

/**
 * ajax 통신 호출
 * @public
 */
nts.model.AutoScrollDao.prototype.findAll = function () {
    var me = this,
        url = 'src/json/data.json';

    me.request(url).then(function (data) {
        me._model.localData = data;
    });
};

/**
 * 모델 생성자 정의
 * @returns {*}
 * @constructor
 */
nts.model.BaseEntity = function () {
    this._data = [];
};

/**
 * 모델 객체의 프로토타입 정의
 */
nts.model.BaseEntity.prototype = {

    /**
     * 데이터를 호출
     * @returns {Object}
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
        this._data = data;

        // 방어 코드
        if (this.dispatchEvent) {
            this.dispatchEvent('update');
        }
    }
};

/**
 * 모델 생성자 정의
 * @extends nts.model.BaseEntity
 * @returns {*}
 * @constructor
 */
nts.model.AutoScrollEntity = function () {
    // 부모 모델의 생성자를 상속
    nts.model.BaseEntity.call(this);
    this._observer = new nts.helper.Observer();
};

/**
 * 부모 모델의 프로토타입을 상속
 * @type {nts.model.BaseEntity}
 */
nts.model.AutoScrollEntity.prototype = Object.create(nts.model.BaseEntity.prototype);
nts.model.AutoScrollEntity.prototype.constructor = nts.model.AutoScrollEntity;

/**
 * 옵저버 객체에 커스텀 이벤트를 등록
 * @param {string} event 커스텀 이벤트 명
 * @param {function} callback 콜백 함수
 * @public
 */
nts.model.AutoScrollEntity.prototype.addEventListener = function (event, callback) {
    this._observer.subscribe(event, callback);
};

/**
 * 옵저버 객체에 있는 커스텀 이벤트를 실행
 * @param {string} event 커스텀 이벤트 명
 * @public
 */
nts.model.AutoScrollEntity.prototype.dispatchEvent = function (event) {
    this._observer.publish(event);
};

/**
 * 컨트롤러 생성자 정의
 * @param {Object} model 모델 객체
 * @param {Object} view 뷰 객체
 * @returns {*}
 * @constructor
 */
nts.controller.AutoScrollController = function (model, view) {
    this._model = model;
    this._view = view;
    this._dao = new nts.model.AutoScrollDao(this._model);

    this._bindViewEvents();
    this._bindModelEvents();
    this._dao.findAll();
};

/**
 * 컨트롤러 객체의 프로토타입 정의
 */
nts.controller.AutoScrollController.prototype = {

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
 * 뷰 생성자 정의
 * @returns {*}
 * @constructor
 */
nts.view.AutoScrollView = function () {
    this._cnt = 15;
    this._length = this._cnt;
    this._observer = new nts.helper.Observer();

    this._insertTemplate();
    this._cacheElements();
};


/**
 * 뷰 객체의 프로토타입 정의
 */
nts.view.AutoScrollView.prototype = {

    /**
     * 뷰 최초 실행함수
     * 템플릿을 내부 변수에 캐시
     * @private
     */
    _insertTemplate: function () {
        this._listTemplate = _.template($('#autoScrollList').html());
        this._bottomTemplate = _.template($('#autoScrollBottom').html());
        this._bottomEndTemplate = _.template($('#autoScrollFinish').html());
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

        for (i = length - this._cnt; i < length; i += 1) {
            /**
             * @typedef {Object} dataObj
             * @property {string} thumb
             * @property {string} playTime
             * @property {string} category
             * @property {string} title
             * @property {number} badge
             */
            dataObj = data[i];

            // 한 번에 처리하는 방법
            template = this._listTemplate({
                thumb: dataObj.thumb,
                playTime: dataObj.playTime,
                category: dataObj.category,
                title: dataObj.title,
                badge: dataObj.badge
            });

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
        this._length += this._cnt;
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

        template = this._bottomTemplate({
            current: this._length.toString(),
            total: data.length.toString()
        });


        this._getMore.html(template);
    },

    /**
     * 뷰 전체 렌더링
     * @param {Object} data 컨트롤러에서 받은 데이터
     * @public
     */
    render: function (data) {
        /**
         * @typedef {Object} data
         * @property {Array} items
         */
        var items = data.items;
        var me = this;

        if (items.length <= me._length) {
            me._noticeFinishRender();
            me._removeEvents();
        } else {
            me._bottomRender(items);
        }

        // 햇님 에니메이션을 위해 0.2초 딜레이
        setTimeout(function () {
            me._listRender(items);
            me._afterRender();
        }, 200);
    }
};

/**
 * observer 생성자 정의
 * @returns {*}
 * @constructor
 */
nts.helper.Observer = function () {
    this._eventHandler = $(this);
};

/**
 * observer 객체의 프로토타입 정의
 */
nts.helper.Observer.prototype = {

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
