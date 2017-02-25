(function () {
    var $add_task = $('.addlist');

    var task_list = [];
    var /*current_index*/ $update_form, $task_detail_content,
        $task_detail_content_input

    init()
    $(".task-detail-mask").on("click", hide_task_detail)

    $add_task.on('click', 'button', function (e) {
        var new_task = {};
        // e.preventDefault();
        new_task.content = $(this).prev().val();

        if (!new_task.content) return
        if (add_task(new_task)) {
            refresh_task_list()
            // render_task_list()
            $(this).prev().val('')
        }
    })

    function listion_task_delete() {
        $(".delete").on("click", function () {
            //$(this).parent().parent().remove();
            var xuhao = $(this).parent().parent().data('index')
            delete_task(xuhao)
            //console.log($(this).parent().parent().data().index)
        })
    }


    function listen_task_detail() {
        $(".task-items").on("dblclick", function () {
            var xuhao = $(this).data('index')
            show_task_detail(xuhao)
        })


        $(".detail").on("click", function () {
            var xuhao = $(this).parent().parent().data('index')
            show_task_detail(xuhao)
            // console.log(xuhao)

        })
    }

    function listen_checkbox_complete() {
        $('.task-list .complete').on('click', function () {
            // var ischecked = $(this).is(':checked')

            var index = $(this).parent().parent().data('index')
            var item = get(index)
            if (item.complete) {
                update_task(index, {
                    complete: false
                })
                // $(this).attr("checkbox", true)
            } else {
                update_task(index, {
                    complete: true
                })
                // $(this).attr("checkbox", false)
            }

        })
    }

    function get(index) {
        return store.get("task_list")[index]
    }

    function show_task_detail(xuhao) {
        render_task_detail(xuhao)
        //   current_index=xuhao

        $(".task-detail").show()
        $(".task-detail-mask").show()
    }

    function update_task(index, data) {
        if (!index || !task_list[index])
            return
        task_list[index] = $.extend({}, task_list[index], data)
        //   console.log(task_list[index],task_list)
        refresh_task_list();
    }

    function hide_task_detail() {
        $(".task-detail").hide()
        $(".task-detail-mask").hide()
    }

    function render_task_detail(index) {
        if (index === undefined || !task_list[index])
            return;

        // console.log(task_list[index])
        var tpl = `<form action="">
        <div class="content">
                ${task_list[index].content}
            </div>
            <div><input style="display:none" type="text" name="content" value="${task_list[index].content}"/></div>
            <div>
                <div class="remake">
                    <textarea name="desc" >${task_list[index].desc||''}</textarea>
                </div>
            </div>
            <div class="remind">
                <input name="remind" type="date" value="${task_list[index].remind}">
                <button type="submit">submit</button>
            </div></form>`

        $('.task-detail').html('')
        $('.task-detail').html(tpl)
        $update_form = $('.task-detail').find('form')
        $task_detail_content = $update_form.find(".content")
        $task_detail_content_input = $update_form.find("[name=content]")


        $task_detail_content.on('dblclick', function () {
            $task_detail_content_input.show()
            $task_detail_content.hide()
            //console.log(1)
        })


        $update_form.on("submit", function (e) {
            e.preventDefault();
            var data = {}
            data.content = $(this).find('[name=content]').val()
            data.desc = $(this).find('[name=desc]').val()
            data.remind = $(this).find('[name=remind]').val()
            // console.log(data)
            update_task(index, data)
            hide_task_detail()
        })
    }

    function add_task(new_task) {

        //alert(1)
        task_list.push(new_task)
        //   console.log(task_list)
        return true

    }


    function refresh_task_list() {
        store.set('task_list', task_list)
        render_task_list()
    }


    function delete_task(index) {
        if (!task_list[index]) return
        delete task_list[index]
        refresh_task_list()
    }

    function init() {
        task_list = store.get('task_list') || []
        //  console.log(store.get('task_list'),task_list.length)
        if (task_list.length) render_task_list()
        //alert(1)
    }

    function render_task_list() {

        $('.task-list').html('')

        var complete_items = []

        for (var i = 0; i < task_list.length; i++) {
            var items = task_list[i]
            if (items && items.complete) {
                complete_items[i] = items
            } else {
                var $task = render_task_item(items, i)
                $('.task-list').prepend($task)
            }
        }
        console.log(complete_items)

        for (var j = 0; j < complete_items.length; j++) {
            $task = render_task_item(complete_items[j], j)
            if (!$task) continue
            $task.addClass('completed')
            $('.task-list').append($task)

        }
        listion_task_delete()
        listen_task_detail()
        listen_checkbox_complete()
    }

    function render_task_item(data, index) {
        //console.log(data)
        if (!data) return
        var list_item_tpl = `<div class="task-items" data-index=${index}>
                <span><input class="complete" ${data.complete?'checked':''} type="checkbox"></span>
                <span class="task-content">${data.content}</span>
                <span class='fr'>
                     <span class='action delete'>删除</span>
                     <span class='action detail'>详细</span>
                </span>       
            </div>`
        return $(list_item_tpl)
    }
})()