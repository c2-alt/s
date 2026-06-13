/**
 * 华夏时讯网 - 第二层：特异账号主页、动态详情与群聊暗号层
 * 模块命名：blog_layer.js
 */

// 1. 该账号的独立动态数据（含键盘侠对线评论区）
const blogPosts = {
    1: {
        time: "2026-06-13 10:02 来自 化为智能手机",
        text: "今天沧海这新闻真是大快人心。我们男的在家里被当成力工，所有的资源全拿去供养小仙女，就该让那些重女轻男的爹妈多看看这种新闻，在绝对力量的死亡威胁之下，男人地位的提高指日可待！",
        likes: 156,
        commentsCount: 28,
        isQuote: false,
        comments: [
            { user: "集美克星2026", text: "支持了兄弟，现在就是不打仗，那些爹妈不知道儿子的好处，咱们泱泱大国男尊女卑了几千年，老祖宗留下的规矩总有他的道理。现在都是被西方给带坏了，其实老美能有今天还是偷了咱们的古书！", likes: 88 },
            { user: "伞伞two了", text: "不知道的以为你们住在他家呢，你又知道他在家里过得不好了？少点以己度人吧。", likes: 120 },
            { user: "果果果锅锅", text: "@沧海公安 @沧海网警 有没有人管管？", likes: 14 }
        ]
    },
    2: {
        time: "2026-06-11 22:15 来自 化为智能手机",
        text: "转发微言：羡慕啊，不过机票太贵了，要是国家能引进俄罗斯美女来咱们这避战，又能提高国际声誉，结婚率和生育率还能上去，一举两得。",
        quoteText: "@呐喊者：‘又撮合了一桩中俄婚姻，想睁眼看世界的兄弟们直接私信我！’",
        likes: 94,
        commentsCount: 12,
        isQuote: true,
        comments: [
            { user: "深海大白鲨", text: "哥们我说实话，你要是连去俄罗斯的机票都买不起，就别幻想娶人家姑娘当媳妇了，让人家来跟你受罪吗？", likes: 41 },
            { user: "飞檐走壁薄荷糖", text: "V我50，给你俄罗斯女孩联系方式。", likes: 65 }
        ]
    }
};

// 2. 群聊分栏数据（3个满员，1个可加入但有暗号）
const groupData = [
    { id: "g_1", name: "莫言的书迷们", desc: "莫言老师的书迷聚集群", status: "群员已满" },
    { id: "g_2", name: "我的26岁女房客阅读交流群", desc: "求上天赐我米彩乐瑶简薇…", status: "群聊已解散" },
    { id: "g_3", name: "沧海本地二手互换", desc: "同城自提", status: "不满足申请条件" },
    // 🔴 核心交互群：可以加，但必须解开暗号
    { id: "g_core", name: "拨乱反正", desc: "龟男滚蛋", status: "verify" }
];

// 3. 主页初始化主入口
function initBlogLayer() {
    // 隐藏新闻主布局
    const mainLayout = document.querySelector(".main-layout");
    if (mainLayout) mainLayout.style.display = "none";

    // 检查是否已经存在主页容器，没有则创建
    let blogContainer = document.getElementById("layer2-blog-container");
    if (!blogContainer) {
        blogContainer = document.createElement("div");
        blogContainer.id = "layer2-blog-container";
        blogContainer.style.cssText = "max-width: 900px; margin: 20px auto; padding: 0 15px;";
        document.body.appendChild(blogContainer);
    }
    blogContainer.style.display = "block";

    // 渲染主页基础骨架（高仿社交平台个人主页）
    blogContainer.innerHTML = `
        <div style="background: #fff; border: 1px solid #e6e6e6; padding: 15px; margin-bottom: 15px; position: relative;">
            <div style="color: var(--link-blue); font-weight: bold; cursor: pointer; margin-bottom: 15px;" onclick="exitBlogLayer()">← 返回社会法制新闻</div>
            <div style="height: 100px; background: #2c3e50; margin: -15px -15px 0 -15px;"></div>
            <div style="margin-top: 15px; display: flex; gap: 20px; align-items: flex-end;">
                <div style="width: 70px; height: 70px; background: #444; border-radius: 50%; border: 3px solid #fff; margin-top: -45px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 24px;">斩</div>
                <div>
                    <h2 style="font-size: 18px; font-weight: bold;">@斩尽天下钕</h2>
                    <p style="font-size: 12px; color: #777; margin-top: 4px;">简介：点进我主页那一刻说明你已经输了。</p >
                </div>
            </div>
        </div>

        <!-- ❗ 核心：与动态平级的群聊分栏标签栏 -->
        <div style="display: flex; background: #fff; border: 1px solid #e6e6e6; margin-bottom: 15px;">
            <div id="blog-tab-posts" style="flex: 1; text-align: center; padding: 12px 0; font-weight: bold; cursor: pointer; border-bottom: 3px solid var(--link-blue); color: var(--link-blue);" onclick="switchBlogTab('posts')">全部动态</div>
            <div id="blog-tab-groups" style="flex: 1; text-align: center; padding: 12px 0; font-weight: bold; cursor: pointer; border-bottom: 3px solid transparent; color: #555;" onclick="switchBlogTab('groups')">参与过的群聊 (${groupData.length})</div>
        </div>

        <!-- 内容承载面板 -->
        <div id="blog-panel-posts"></div>
        <div id="blog-panel-groups" style="display: none;"></div>
    `;

    // 默认渲染动态列表
    renderPostList();
    renderGroupList();
    window.scrollTo(0, 0);
}

// 4. 退出主页返回新闻
function exitBlogLayer() {
    document.getElementById("layer2-blog-container").style.display = "none";
    const postDetail = document.getElementById("layer2-post-detail");
    if (postDetail) postDetail.style.display = "none";
    
    document.querySelector(".main-layout").style.display = "flex";
    window.scrollTo(0, 0);
}

// 5. 标签页切换逻辑
function switchBlogTab(tab) {
    const tabPosts = document.getElementById("blog-tab-posts");
    const tabGroups = document.getElementById("blog-tab-groups");
    const panelPosts = document.getElementById("blog-panel-posts");
    const panelGroups = document.getElementById("blog-panel-groups");

    if (tab === "posts") {
        tabPosts.style.color = "var(--link-blue)";
        tabPosts.style.borderBottomColor = "var(--link-blue)";
        tabGroups.style.color = "#555";
        tabGroups.style.borderBottomColor = "transparent";
        panelPosts.style.display = "block";
        panelGroups.style.display = "none";
    } else {
        tabGroups.style.color = "var(--link-blue)";
        tabGroups.style.borderBottomColor = "var(--link-blue)";
        tabPosts.style.color = "#555";
        tabPosts.style.borderBottomColor = "transparent";
        panelPosts.style.display = "none";
        panelGroups.style.display = "block";
    }
}

// 6. 渲染动态（支持文字、转发样式与点击进入详情）
function renderPostList() {
    const container = document.getElementById("blog-panel-posts");
    container.innerHTML = "";

    Object.keys(blogPosts).forEach(id => {
        const post = blogPosts[id];
        const card = document.createElement("div");
        card.style.cssText = "background: #fff; border: 1px solid #e6e6e6; padding: 20px; margin-bottom: 15px;";
        
        let bodyHTML = `<p style="font-size: 15px; line-height: 1.6; color: #222; cursor: pointer; text-align: justify;" onclick="openPostDetail(${id})">${post.text}</p >`;
        
        // 如果是转发类型，渲染转发框
        if (post.isQuote) {
            bodyHTML += `
                <div style="background: #f7f8fa; border: 1px solid #eaebed; padding: 12px; margin-top: 10px; font-size: 14px; color: #555; text-align: justify;">
                    ${post.quoteText}
                </div>`;
        }

        card.innerHTML = `
            <div style="font-size: 12px; color: #999; margin-bottom: 10px;">${post.time}</div>
            ${bodyHTML}
            <div style="margin-top: 15px; border-top: 1px solid #f2f2f2; padding-top: 10px; display: flex; font-size: 13px; color: #666;">
                <div style="width: 50%; text-align: center; cursor: pointer;" onclick="openPostDetail(${id})">💬 评论 ${post.commentsCount}</div>
                <div style="width: 50%; text-align: center; cursor: pointer;" onclick="alert('点赞成功')">👍 赞 ${post.likes}</div>
            </div>
        `;
        container.appendChild(card);
    });
}

// 7. 进入帖子独立详情页（含对线评论区与全套点赞回复功能）
function openPostDetail(postId) {
    document.getElementById("layer2-blog-container").style.display = "none";
    
    let detailView = document.getElementById("layer2-post-detail");
    if (!detailView) {
        detailView = document.createElement("div");
        detailView.id = "layer2-post-detail";
        detailView.style.cssText = "max-width: 700px; margin: 20px auto; padding: 0 15px;";
        document.body.appendChild(detailView);
    }
    detailView.style.display = "block";

    const post = blogPosts[postId];
    
    // 生成对线评论流的内容
    let commentItemsHTML = "";
    post.comments.forEach((c, idx) => {
        commentItemsHTML += `
            <div style="display: flex; gap: 12px; padding: 15px 0; border-bottom: 1px solid #eee;">
                <div style="width: 32px; height: 32px; background: #ccc; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; font-weight: bold;">匿</div>
                <div style="flex: 1;">
                    <div style="font-size: 13px; font-weight: bold; color: #444;">${c.user}</div>
                    <div style="font-size: 14px; margin-top: 4px; color: #222; text-align: justify;">${c.text}</div>
                    <div style="margin-top: 8px; display: flex; gap: 15px; font-size: 12px; color: #888;">
                        <span style="cursor: pointer;" onclick="alert('点赞成功')">👍 ${c.likes}</span>
                        <span style="cursor: pointer;" onclick="togglePostReplyInput('${postId}_${idx}')">💬 回复</span>
                    </div>
                    <!-- 独立详情页的二级嵌套回复框 -->
                    <div id="reply-box-${postId}_${idx}" style="display: none; gap: 10px; margin-top: 10px;">
                        <input type="text" placeholder="回复 @${c.user}..." style="flex:1; padding: 6px; border: 1px solid #ccc; font-size: 13px; outline: none;">
                        <button style="background: #333; color: white; border: none; padding: 0 12px; cursor: pointer; font-size: 12px;" onclick="submitPostSubReply('${postId}_${idx}', '${c.user}')">提交</button>
                    </div>
                    <div id="sub-list-${postId}_${idx}" style="background: #f8f9fa; padding: 6px 10px; margin-top: 8px; font-size: 13px; display: none; flex-direction: column; gap: 4px;"></div>
                </div>
            </div>`;
    });

    detailView.innerHTML = `
        <div style="color: var(--link-blue); font-weight: bold; cursor: pointer; margin-bottom: 15px;" onclick="closePostDetail()">← 返回主页动态</div>
        <div style="background: #fff; border: 1px solid #e6e6e6; padding: 20px; margin-bottom: 20px;">
            <div style="font-size: 12px; color: #999; margin-bottom: 10px;">${post.time}</div>
            <p style="font-size: 16px; line-height: 1.6; color: #000; text-align: justify;">${post.text}</p >
            ${post.isQuote ? `<div style="background: #f7f8fa; border: 1px solid #eaebed; padding: 12px; margin-top: 10px; font-size: 14px; color: #555;">${post.quoteText}</div>` : ""}
        </div>

        <div style="background: #fff; border: 1px solid #e6e6e6; padding: 20px;">
            <h3 style="font-size: 15px; border-bottom: 2px solid #333; padding-bottom: 8px; margin-bottom: 15px;">动态互动区</h3>
            <div style="display: flex; gap: 10px; margin-bottom: 20px;">
                <input type="text" id="detail-main-input" placeholder="发表你的高见..." style="flex: 1; padding: 8px; border: 1px solid #ccc; outline: none;">
                <button style="background: var(--portal-red); color: white; border: none; padding: 0 15px; cursor: pointer;" onclick="submitDetailMainComment('${postId}')">发表</button>
            </div>
            <div id="detail-comment-stream">${commentItemsHTML}</div>
        </div>
    `;
    window.scrollTo(0, 0);
}

function closePostDetail() {
    document.getElementById("layer2-post-detail").style.display = "none";
    document.getElementById("layer2-blog-container").style.display = "block";
}

function togglePostReplyInput(id) {
    const box = document.getElementById(`reply-box-${id}`);
    box.style.display = box.style.display === "flex" ? "none" : "flex";
}

fun
