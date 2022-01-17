# WeSing Cli

WeSing 统一命令行工具，基于 yargs 、inquirer

## 安装
```bin
yarn global add @tencent/wesing-cli
```
## 使用

### pb2ts

protobuf 协议转 ts 类型

```typescript
interface Arguments {
  // 「项目 ID」或「项目全路径」
  id?: string,
  // 填入 commit hash、branch name、tag name
  sha?: string
  // 输入 protobuf 协议路径（相对于仓库路径）
  path?: string
	// 输出路径
  output?: string
}
```

### jce2js

jce 协议转 js

```typescript
interface Arguments {
  // 「项目 ID」或「项目全路径」
  id?: string,
  // 填入 commit hash、branch name、tag name
  sha?: string
  // 输入 protobuf 协议路径（相对于仓库路径）
  path?: string
	// 输出路径
  output?: string
}
```

### jce2ts

```typescript
interface Arguments {
  // 「项目 ID」或「项目全路径」
  id?: string,
  // 填入 commit hash、branch name、tag name
  sha?: string
  // 输入 protobuf 协议路径（相对于仓库路径）
  path?: string
	// 输出路径
  output?: string
}
```



## 发布

- 执行 `npm run release:patch`，生成 ChangeLog、打 Tag
- 执行 `npm publish` ，推送 Tag & 发布到 tnpm
- http://mirrors.tencent.com/#/private/npm/detail?repo_id=537&project_name=%40tencent%2Fwesing-cli 发布成功检查地址

