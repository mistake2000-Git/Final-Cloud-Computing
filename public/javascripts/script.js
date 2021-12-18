

//load members data
$(()=>{
    //load data
        var load = function(){$.ajax  
        ({
            url:'/member/getall',
            contentType:'application/json',
            success: (res)=>{
                var bodyTable = $('tbody');
                bodyTable.html('');
                console.log(res)
                res.forEach(element => {
                    bodyTable.append('\
                    <tr>\
                     <td class="id">' + element._id+ ' </td>\
                     <td><input type="text" class="name" value="'+element.name+'" ></td>\
                     <td><input type="text" class="position" value='+element.position+'></td>\
                     <td><button class="update-button">UPDATE</button>\
                     <button class="delete-button">DELETE</button></td>\
                    </tr> ')
                });
            }
        })}
        load()
    //add member
    $(document).ready(()=>{
        $("#insert-form").on("submit",(event)=>{
            event.preventDefault();
            let _id = $("#id").val();
            let name = $("#name").val();
            let position = $("#position").val();
            $.ajax({
                url:'/member/createMember',
                method:"POST",
                contentType:"application/json",
                data: JSON.stringify({_id:_id,name:name,position:position}),
                success: (res)=>{
                    $('#alert').html(`Message: ${res.message}`)
                    $(load())
                }
            })
            
        })
    })
    //DELETE Members
    $('table').on('click','.delete-button',function(){
        var rowEl = $(this).closest('tr')
        var id = rowEl.find('.id').text()
        $.ajax({
            url: '/member/delete/'+ id,
            method: "DELETE",
            contentType: "application/json",
            success: (res)=>{
                $('#alert').html(`Message: ${res.message}`)
                $(load())
            }
        })
    })
    //Update member information
    $('table').on('click','.update-button',function(){
        var rowEl = $(this).closest('tr')
        var id = rowEl.find('.id').text()
        var newName = rowEl.find('.name').val()
        var newPosition = rowEl.find('.position').val()
        $.ajax({
            url: '/member/update',
            method: "PUT",
            contentType: "application/json",
            data: JSON.stringify({_id:id.trim(),name:newName,position:newPosition}),
            success: (res)=>{
                $('#alert').html(`Message: ${res.message}`)
                $(load())
            }
        })
    })
})


