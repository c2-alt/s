/**
 * 华夏时讯网 - 第三层：私密群聊内部线索交互层
 * 模块命名：chat_layer.js
 */

// 1. 模拟50条高密度群聊历史记录（全员居左，带节奏，埋伏笔）
const groupChatHistory = [
    { user: "管理员-指路人", role: "admin", text: "欢迎新进群的兄弟，多看群公告，纯度不够的自己滚，别等我踢。" },
    { user: "独行狼", role: "member", text: "兄弟们，气死我了，今天去找我姐要钱，她居然一分不给，还说以后都要拉黑我。" },
    { user: "逆蝶是我", role: "member", text: "这种姐还活着干啥，满脑子都是她自己那个家，跟你们都不是一条心了。" },
    { user: "小丑竟是我", role: "member", text: "呵呵，现在的女人不都这样，自私自利。" },
    { user: "集美克星2026", role: "member", text: "老祖宗留下的规矩丢光了，现在的世道就是阴盛阳衰，阴阳颠倒！" },
    { user: "纯度极高", role: "member", text: "支持！弱肉强食才是真理，天天被小作文压榨，早就该反击了。" },
    { user: "多次拒绝卡戴珊", role: "member", text: "前几天那个传的很凶的迷奸案，有兄弟知道来龙去脉吗？是不是舔狗的正义制裁？" },
    { user: "独行狼", role: "member", text: "警方封锁消息了，不过看网上的风向，各大平台又在骂男人，真恶心。" },
    { user: "管理员-指路人", role: "admin", text: "舆论阵地我们抢不过，但现实中我们可以执行我们自己的‘正义’。" },
    { user: "自由之翼", role: "member", text: "说得对！现实碰一碰，哪个女的来都不好使！" },
    { user: "那叫一地道", role: "member", text: "话说回来，群里好几天没发福利了，天天聊理论有点枯燥啊兄弟们。" },
    { user: "小丑竟是我", role: "member", text: "就是，来点实在的，整天看新闻人都要抑郁了。" },
    { user: "集你太美", role: "member", text: "上次那个偷拍商场试衣间的大佬呢？怎么退群了？" },
    { user: "管理员-指路人", role: "admin", text: "那家伙太高调，被网警顺藤摸瓜了。进群第一条：安全第一。" },
    { user: "清风拂袖", role: "member", text: "切，没劲。现在外面查得严，哪还有人敢顶风作案拍福利。" },
    { user: "独行狼", role: "member", text: "蹲一个胆子大的兄弟，最好是身边人的，那种才带劲。" },
    { user: "自由之翼", role: "member", text: "同蹲，网上的网盘资源都看烂了，没意思。" },
    
    // 🔴 关键剧情切入：凶手小李出场，头像可点击
    { user: "斩杀仙人", role: "killer", text: "我这里有点新鲜的，有人要看吗？" },
    
    { user: "桦", role: "member", text: "什么内容？偷拍厕所还是浴室？" },
    
    // 🔴 伏笔句：提到偷拍家里姐姐妹妹
    { user: "斩杀仙人", role: "killer", text: "不是外面的。是我家里的。家里有个姐姐还有一个妹妹，天天在家里穿个睡衣晃悠，骚得不行，兄弟们想看我就拍，算给大家发福利了。" },
    
    { user: "宇子", role: "member", text: "大义灭亲啊哥们！可以可以！这就叫物尽其用！" },
    { user: "一拳打死你妈", role: "member", text: "真假？窝边草才是最高境界啊，什么时候想更进一步可以私我，我这有很多无色无味的，就是得录下来给兄弟们看看。" },
    { user: "666C", role: "member", text: "行啊，进群太有福利了，诶，先把她们俩的素颜照发来看看。" },
    { user: "小丑竟是我", role: "member", text: "赶紧的，大家都等着呢。" },
    
    // 🔴 剧情转折：凶手心态失衡，交代作案动机
    { user: "斩杀仙人", role: "killer", text: "等等吧，我现在手头没有，今天他们三个都送那个小的去比赛了，我才懒得去给她捧场，也不知道一个女的去参加数学竞赛干嘛，女的能学好数学吗？" },
    
    { user: "管理员-指路人", role: "admin", text: "等她再大点就学不会了，女人都是越长越笨，不像我们有后劲啊。" },
    { user: "自由之翼", role: "member", text: "没错，兄弟别灰心，等他们回来记得拍照啊。" },
    { user: "终结", role: "member", text: "我家里也是有姐有妹，我姐嫁人的彩礼已经到手了，我现在都不想让我妹读书了，抓紧出去嫁人得了，你哥还等钱花呢。" },
    { user: "独行狼", role: "member", text: "真爽啊，这就叫物尽其用。" },
    { user: "斩杀仙人", role: "killer", text: "真羡慕你，我爸妈也不知道怎么想的，特别花心思培养她们俩，明明我才是这个家的香火，真想杀了他们。" },
    { user: "管理员-指路人", role: "admin", text: "逆天，我以后要是生了女儿绝对不会像网上那些龟男一样，到时候给兄弟们发福利。" },
    { user: "sloto", role: "member", text: "牛逼啊，大义灭亲，海角需要你。" },
    { user: "666C", role: "member", text: "岳父放开我老婆～！" },
    { user: "小丑竟是我", role: "member", text: "有小萝莉看咯哈哈" },
    { user: "涟漪G", role: "member", text: "说了半天一张图都没有，散了散了。 [历史记录至此结束]" }
];

// 2. 初始化群聊主界面
function initChatLayer() {
    // 隐藏第二层博客容器
    const blogContainer = document.getElementById("layer2-blog-container");
    if (blogContainer) blogContainer.style.display = "none";

    let chatContainer = document.getElementById("layer3-chat-container");
    if (!chatContainer) {
        chatContainer = document.createElement("div");
        chatContainer.id = "layer3-chat-container";
        chatContainer.style.cssText = "max-width: 650px; margin: 20px auto; padding: 0 15px;";
        document.body.appendChild(chatContainer);
    }
    chatContainer.style.display = "block";

    // 渲染暗网群聊 UI 骨架（纯粹的仿聊天客户端）
    chatContainer.innerHTML = `
        <div style="color: var(--link-blue); font-weight: bold; cursor: pointer; margin-bottom: 15px;" onclick="exitChatToBlog()">← 返回群组列表</div>
        
        <div style="background: #eaeaea; border: 1px solid #dcdcdc; height: 650px; display: flex; flex-direction: column; border-radius: 4px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
            <!-- 群聊头部栏 -->
            <div style="background: #f5f5f5; padding: 15px; font-weight: bold; border-bottom: 1px solid #ddd; text-align: center; font-size: 15px; color: #333; letter-spacing: 0.5px;">
                内网加密通道：拨乱反正 (35)
            </div>
            
            <!-- 消息滚动的核心舞台（所有消息严格靠左排列） -->
            <div id="chat-message-stream" style="flex: 1; padding: 15px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; background: #eaeaea;">
                <div style="text-align: center; font-size: 12px; color: #999; margin: 5px 0;">--- 以上为 2026-06-12（案发当晚）历史同步备份记录 ---</div>
                <div id="chat-history-core-box" style="display: flex; flex-direction: column; gap: 14px;"></div>
                <div id="player-chat-insert-anchor"></div>
            </div>

            <!-- 底部输入框（只读提示 / 允许输入做互动反馈） -->
            <div style="background: #f5f5f5; padding: 12px; display: flex; gap: 10px; border-top: 1px solid #ddd;">
                <input type="text" id="player-group-input" style="flex: 1; padding: 10px 12px; border: 1px solid #ccc; border-radius: 4px; outline: none; font-size: 14px;" placeholder="发送群消息..." readonly>
                <button style="background: #aaa; color: white; border: none; padding: 0 20px; border-radius: 4px; cursor: not-allowed; font-size: 14px; font-weight: bold;">禁言</button>
            </div>
        </div>
    `;

    renderGroupHistoryStream();
}

// 3. 循环渲染历史对话流（精准控制头像和居左样式）
function renderGroupHistoryStream() {
    const box = document.getElementById("chat-history-core-box");
    box.innerHTML = "";

    groupChatHistory.forEach(msg => {
        const item = document.createElement("div");
        item.style.cssText = "display: flex; gap: 12px; max-width: 90%; align-self: flex-start; text-align: left;";

        // 根据角色设置头像外观和可点击属性
        let avatarStyle = "width: 38px; height: 38px; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; flex-shrink: 0; color: white;";
        let avatarAction = "";
        let avatarText = msg.user.charAt(0);

        if (msg.role === "admin") {
            avatarStyle += "background: #d35400;"; // 管理员偏橘红色
        } else if (msg.role === "killer") {
            // 🔴 凶手小李：头像高亮、鼠标移上去变成手势、点击触发特异弹窗
            avatarStyle += "background: #c0392b; cursor: pointer; border: 2px solid #ff4d4d; box-shadow: 0 0 8px rgba(192,57,43,0.6);";
            avatarAction = `onclick="viewKillerProfile()" title="点击查看该用户离线留存资料"`;
            avatarText = "李";
        } else {
            avatarStyle += "background: #7f8c8d;"; // 普通键盘侠灰色
        }

        // 气泡渲染布局（全员居左）
        item.innerHTML = `
            <div class="chat-avatar" style="${avatarStyle}" ${avatarAction}>${avatarText}</div>
            <div>
                <div style="font-size: 11px; color: ${msg.role === 'killer' ? '#cc0000; font-weight: bold;' : '#777'}; margin-bottom: 3px;">
                    ${msg.user} ${msg.role === 'killer' ? ' (涉案目标 - 离线)' : ''}
                </div>
                <div style="background: #fff; padding: 10px 12px; border-radius: 0 8px 8px 8px; font-size: 14px; line-height: 1.5; color: #222; box-shadow: 0 1px 2px rgba(0,0,0,0.08); text-align: justify; white-space: pre-wrap;">${msg.text}</div>
            </div>
        `;
        box.appendChild(item);
    });

    // 延迟自动滚动到聊天底部，让玩家一眼看清结局
    setTimeout(() => {
        const stream = document.getElementById("chat-message-stream");
        if (stream) stream.scrollTop = stream.scrollHeight;
    }, 100);
}

// 4. 🔴 侦探核心：点击凶手头像弹出的“隐藏资料深层线索”
function viewKillerProfile() {
    const profileData = `【华夏网络安全网监支队 - 离线日志调取】
--------------------------------------------
群名片：斩杀仙人
系统ID：UID-9952714
最后在线IP：112.24.89.XX（沧海市学府景苑小区3栋2单元）
账号状态：异常终止 / 设备已损毁

【近期个人空间签名 / 随手记备份】：
“no one love me"
--------------------------------------------

    alert(profileData);
}

// 5. 退出群聊返回第二层群列表
function exitChatToBlog() {
    document.getElementById("layer3-chat-container").style.display = "none";
    document.getElementById("layer2-blog-container").style.display = "block";
    // 确保切回群聊选项卡
    if (typeof switchBlogTab === "function") {
        switchBlogTab('groups');
    }
}
