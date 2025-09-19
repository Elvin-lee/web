// 资源类型配置模板
const resourceTemplates = {
    vm: `
        <h2 class="text-xl font-semibold text-gray-700 mb-4">虚拟机配置</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">CPU核心数</label>
                <select class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>1核</option>
                    <option>2核</option>
                    <option>4核</option>
                    <option>8核</option>
                    <option>16核</option>
                </select>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">内存大小</label>
                <select class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>1GB</option>
                    <option>2GB</option>
                    <option>4GB</option>
                    <option>8GB</option>
                    <option>16GB</option>
                    <option>32GB</option>
                </select>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">操作系统</label>
                <select class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>CentOS 7</option>
                    <option>CentOS 8</option>
                    <option>Ubuntu 20.04</option>
                    <option>Ubuntu 22.04</option>
                    <option>Windows Server 2019</option>
                </select>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">系统盘大小(GB)</label>
                <input type="number" min="20" max="1024" value="50" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">是否需要数据盘</label>
                <div class="mt-2">
                    <label class="inline-flex items-center">
                        <input type="radio" name="data_disk" value="no" class="h-4 w-4 text-blue-600" checked>
                        <span class="ml-2 text-gray-700">不需要</span>
                    </label>
                    <label class="inline-flex items-center ml-6">
                        <input type="radio" name="data_disk" value="yes" class="h-4 w-4 text-blue-600">
                        <span class="ml-2 text-gray-700">需要</span>
                    </label>
                </div>
            </div>
            <div id="dataDiskConfig" class="hidden">
                <label class="block text-sm font-medium text-gray-700 mb-1">数据盘大小(GB)</label>
                <input type="number" min="20" max="2048" value="100" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
        </div>
    `,
    db: `
        <h2 class="text-xl font-semibold text-gray-700 mb-4">数据库配置</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">数据库引擎</label>
                <select class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>MySQL 5.7</option>
                    <option>MySQL 8.0</option>
                    <option>PostgreSQL 12</option>
                    <option>PostgreSQL 14</option>
                    <option>MongoDB 4.4</option>
                    <option>Redis 6</option>
                </select>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">实例规格</label>
                <select class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>1核2GB</option>
                    <option>2核4GB</option>
                    <option>4核8GB</option>
                    <option>8核16GB</option>
                    <option>16核32GB</option>
                </select>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">存储空间(GB)</label>
                <input type="number" min="20" max="2048" value="100" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">字符集</label>
                <select class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>utf8</option>
                    <option>utf8mb4</option>
                    <option>latin1</option>
                </select>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">是否需要备份</label>
                <div class="mt-2">
                    <label class="inline-flex items-center">
                        <input type="radio" name="backup" value="no" class="h-4 w-4 text-blue-600" checked>
                        <span class="ml-2 text-gray-700">不需要</span>
                    </label>
                    <label class="inline-flex items-center ml-6">
                        <input type="radio" name="backup" value="yes" class="h-4 w-4 text-blue-600">
                        <span class="ml-2 text-gray-700">需要</span>
                    </label>
                </div>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">访问方式</label>
                <div class="mt-2">
                    <label class="inline-flex items-center">
                        <input type="radio" name="access" value="internal" class="h-4 w-4 text-blue-600" checked>
                        <span class="ml-2 text-gray-700">内网访问</span>
                    </label>
                    <label class="inline-flex items-center ml-6">
                        <input type="radio" name="access" value="external" class="h-4 w-4 text-blue-600">
                        <span class="ml-2 text-gray-700">公网访问</span>
                    </label>
                </div>
            </div>
        </div>
    `,
    storage: `
        <h2 class="text-xl font-semibold text-gray-700 mb-4">存储配置</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">存储类型</label>
                <select class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>对象存储</option>
                    <option>文件存储</option>
                    <option>块存储</option>
                    <option>归档存储</option>
                </select>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">存储容量(GB)</label>
                <input type="number" min="1" max="10240" value="100" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">访问协议</label>
                <select class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>NFS</option>
                    <option>SMB</option>
                    <option>FTP</option>
                    <option>S3</option>
                </select>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">存储冗余策略</label>
                <select class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>本地冗余</option>
                    <option>同城冗余</option>
                    <option>异地冗余</option>
                </select>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">是否需要加密</label>
                <div class="mt-2">
                    <label class="inline-flex items-center">
                        <input type="radio" name="encrypt" value="no" class="h-4 w-4 text-blue-600" checked>
                        <span class="ml-2 text-gray-700">不需要</span>
                    </label>
                    <label class="inline-flex items-center ml-6">
                        <input type="radio" name="encrypt" value="yes" class="h-4 w-4 text-blue-600">
                        <span class="ml-2 text-gray-700">需要</span>
                    </label>
                </div>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">生命周期(天)</label>
                <input type="number" min="1" max="3650" value="180" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
        </div>
    `
};