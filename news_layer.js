/**
 * 华夏时讯网 - 新闻层交互逻辑
 * 当前开发阶段：第一层（新闻与全功能评论互动）
 */

// 1. 初始化包含12条评论的超拟真数据库（特殊评论完全混在中间，不带任何特权标记）
const initialComments = [
    { id: "c_1", user: "Windy_99", text: "十七岁对亲生父母下这种死手，简直泯灭人性！不管是出于什么家庭矛盾，这都不是杀害爹妈的理由。建议直接死刑。", likes: 342, replies: [{ from: "Momo不吃香菜", text: "支持，不管怎么说杀人都该偿命，就算对家人有不满，高考后去个外地的大学，从此再也不联系呗。杀人不仅毁了家庭，还毁了自己的未来啊。" }] },
    { id: "c_2", user: "悲伤小狗", text: "高二刚好是学业压力最重的时候，我当年高二高三整整两年，都像个一点就炸的火药桶，日复一日早七晚十，比蹲监狱还苦。人的情绪往往在某一瞬间就失控了，我猜未必是多大的矛盾，只是压倒骆驼的最后一根稻草。", likes: 189, replies: [] },
    { id: "c_3", user: "沧海一声啸", text: "学府景苑？这小区在我们家附近，这片学区房很贵的，家里为他上学方便这么下血本，真想不通有什么深仇大恨。昨晚救护车和警车响了一半夜，吓死人了。现在的孩子啊…", likes: 95, replies: [] },
    { id: "c_4", user: "冰美式不加糖", text: "未知全貌不予置评。有些家庭内部的剥削和窒息，外人是根本无法想象的，但杀人肯定是犯罪，就算事出有因，也不能说他无辜。", likes: 210, replies: [{ from: "雪松", text: "供你吃喝拉撒，一把屎一把尿养大你的时候，怎么不说剥削和窒息了？" }] },
    
    // 🔴 核心特殊评论：混迹在普通网民中，没有任何标志。
    // 注意：它的头像和呢称都绑定了点击事件，但目前点击只弹出一个占位提示，等待第二层开发。
    { id: "c_clue", user: "斩尽天下钕", text: "有什么好圣母的？这世上多的是偏心、自私、恶心的父母，口口声声说爱儿子，对儿子还没有对女儿大方。这家人就是买房子的时候把家底掏空了，男孩子十六七岁正是要面子的时候，向家里要不到钱，在学校被嘲笑了。这波是正义执行，先生大义！", likes: 45, replies: [{ from: "蛋蛋的小羊", text: "为了打拳，杀人犯都能共情，无敌。" }] },
    
    { id: "c_5", user: "爱吃大西瓜（教资必过版）", text: "希望警方能尽快公布详细的案情，到底是积怨已久还是突然失控，毕竟是恶性事件，藏着掖着反而滋生谣言。", likes: 23, replies: [] },
    { id: "c_6", user: "静心", text: "愿死者安息。虽然父母可能有做得不对的地方，但用这种极端方式把路走绝了，自己的一生也彻底毁了。悲剧啊。", likes: 74, replies: [] },
    { id: "c_7", user: "白熊拎着八斤橘子", text: "未成年不是保护伞！虽然17岁在法律上面临减刑的可能，但这手段太恶劣了，必须从严从重惩处！", likes: 512, replies: [] },
    { id: "c_8", user: "阳光明媚123", text: "天天看这种阴暗的新闻，整个人都不好了，我去听听红歌回回血。", likes: 11, replies: [] },
    { id: "c_9", user: "银牙", text: "很多家长的控制欲确实可怕，再加上现在学生压力太大了，不过再怎么样，用刀把父母给…还是太狠了。", likes: 66, replies: [] },
    { id: "c_10", user: "深海里的猫", text: "我的天……现在的孩子到底怎么了？什么样的仇恨能让一个高二的学生对亲人举起钢刀？不敢想父母临死前得有多寒心！", likes: 89, replies: [] },
    { id: "c_11", user: "鲨鱼君", text: "估计又是玩游戏或者要钱起冲突吧，现在的这些青少年冲动起来根本没有理智可言，和国外那些teenager一样，自觉有未成年保护法傍身。", likes: 41, replies: [] }
];

// 2. 页面加载时自动执行渲染
document.addEventListener("DOMContentLoaded", () => {
    renderAllComments();
});

// 3. 全局渲染函数
function renderAllComments() {
    const listContainer = document.getElementById("global-comment-list");
    listContainer.innerHTML = "";

    initialComments.forEach(comment => {
        const itemNode = document.createElement("div");
        itemNode.className = "comment-item-node";
        itemNode.id = comment.id;

        // 根据用户名取首字做头像
        const firstChar = comment.user.charAt(0);
        
        // 核心设计：如果用户名是"斩尽天下钕"，它的头像和昵称点击事件会指向我们预留的逻辑，其他账号则提示普通功能
        const isClueAccount = (comment.user === "斩尽天下钕");
        const avatarClickAction = isClueAccount ? "triggerClueProfile()" : "alert('该用户未开放公开主页')";

        // 生成二级盖楼回复的内容
        let subCommentsHTML = "";
        if (comment.replies.length > 0) {
            subCommentsHTML = `<div class="nested-sub-list" id="${comment.id}-sub-list">`;
            comment.replies.forEach(reply => {
                subCommentsHTML += `
                    <div class="nested-sub-item">
                        <span class="nested-user">${reply.from}</span>：${reply.text}
                    </div>`;
            });
            subCommentsHTML += `</div>`;
        } else {
            // 如果本来没有回复，先放一个隐藏的容器以便后续玩家动态追加
            subCommentsHTML = `<div class="nested-sub-list" id="${comment.id}-sub-list" style="display:none;"></div>`;
        }

        itemNode.innerHTML = `
            <!-- 头像 -->
            <div class="c-avatar-node" style="cursor:pointer;" onclick="${avatarClickAction}">${firstChar}</div>
            
            <!-- 评论主体 -->
            <div class="c-main-node">
                <div class="c-user-info" style="cursor:pointer;" onclick="${avatarClickAction}">${comment.user}</div>
                <div class="c-text-content">${comment.text}</div>
                
                <!-- 互动状态条（点赞与回复按钮） -->
                <div class="c-actions-bar">
                    <span>发表于随后</span>
                    <div class="action-btn-item" onclick="handleLike('${comment.id}')">
                        👍 <span>${comment.likes}</span>
                    </div>
                    <div class="action-btn-item" onclick="openReplyInput('${comment.id}')">
                        💬 回复
                    </div>
                </div>

                <!-- 嵌套评论槽 -->
                ${subCommentsHTML}

                <!-- 动态行内回复输入框 -->
                <div class="dynamic-reply-box" id="${comment.id}-reply-box">
                    <input type="text" placeholder="回复 @${comment.user}...">
                    <button onclick="submitSubReply('${comment.id}', '${comment.user}')">提交</button>
                </div>
            </div>
        `;
        listContainer.appendChild(itemNode);
    });
}

// 4. 点赞互动逻辑
function handleLike(commentId) {
    const comment = initialComments.find(c => c.id === commentId);
    if (comment) {
        comment.likes += 1;
        // 局部刷新点赞数字，保持逼真体验
        const likeSpan = document.querySelector(`#${commentId} .action-btn-item span`);
        if (likeSpan) likeSpan.innerText = comment.likes;
    }
}

// 5. 显示/隐藏行内回复输入框
function openReplyInput(commentId) {
    const box = document.getElementById(`${commentId}-reply-box`);
    if (box) {
        box.style.display = (box.style.display === "flex") ? "none" : "flex";
        if (box.style.display === "flex") {
            box.querySelector("input").focus();
        }
    }
}

// 6. 提交二级楼层回复
function submitSubReply(commentId, targetUser) {
    const box = document.getElementById(`${commentId}-reply-box`);
    const input = box.querySelector("input");
    const text = input.value.trim();
    if (!text) return;

    // 局部追加入 DOM
    const subList = document.getElementById(`${commentId}-sub-list`);
    subList.style.display = "flex";

    const newReplyItem = document.createElement("div");
    newReplyItem.className = "nested-sub-item";
    newReplyItem.innerHTML = `<span class="nested-user">匿名网友</span> 回复 <span class="nested-user">@${targetUser}</span>：${text}`;
    
    subList.appendChild(newReplyItem);
    
    // 清空并关闭输入框
    input.value = "";
    box.style.display = "none";
}

// 7. 玩家在顶层发布全新的新闻一级评论
function publishMainComment() {
    const textarea = document.getElementById("main-comment-textarea");
    const text = textarea.value.trim();
    if (!text) return;

    const newId = "custom_" + Date.now();
    const newCommentObj = {
        id: newId,
        user: "匿名网民",
        text: text,
        likes: 0,
        replies: []
    };

    // 把玩家的评论顶到列表最前面
    initialComments.unshift(newCommentObj);
    renderAllComments();
    textarea.value = "";
}

// 🔴 特殊账号触发逻辑（第一层限定：先不做主页内容，仅做接口留空与提示）
function triggerClueProfile() {
    // 这里我们先使用一个纯弹窗提示。当你对我说“我们要开始做第二层”时，我们再把这里改成加载第二层的 JS。
    alert("系统检测：你点击了核心特异账号【逆流的鲲】的头像。第一层线索拦截成功！准备好之后请指令我创建第二层（主页层）脚本。");
}
