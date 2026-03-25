---
name: "skill-creator"
description: "技能创建指导工具。做什么：提供技能结构指导、SKILL.md 文件格式规范、创建步骤指导、技能示例和最佳实践。何时调用：用户需要创建新的技能、添加自定义技能到工作区、询问如何创建技能或需要设置技能模板时。"
---

# Skill Creator

## 功能
- 提供SKILL结构指导
- 制定SKILL.md文件格式规范
- 指导技能创建步骤
- 提供技能示例和最佳实践
- 验证技能结构的正确性

## 使用场景
- 当用户需要创建新的技能时
- 当用户需要添加自定义技能到工作区时
- 当用户询问如何创建技能时
- 当用户需要设置技能模板时
- 当用户提到创建/添加/制作任何技能时

## SKILL结构
一个有效的SKILL需要：
1. **目录**：`.trae/skills/<skill-name>/`
2. **文件**：`SKILL.md` 在目录内

## SKILL.md格式
```markdown
---
name: "<skill-name>"
description: "<简洁描述，包括：(1) 技能做什么，(2) 何时调用。保持在200字符以内以获得最佳显示效果>"
---

# <技能标题>

<详细说明、使用指南和示例>
```

## 必需字段
| 字段 | 位置 | 描述 |
|-------|----------|-------------|
| `name` | 前置内容 | 技能的唯一标识符 |
| `description` | 前置内容 | **关键**：必须包含 (1) 技能做什么 AND (2) 何时调用。这有助于模型决定何时使用该技能。保持在200字符以内。 |
| `detail` | 正文 | 前置内容后的完整markdown内容 |

## 创建步骤
1. 向用户询问技能名称和目的
2. **重要**：生成 `description` 字段时，始终包括：
   - 技能做什么（功能）
   - **必须强调何时调用**（触发条件/场景）
   - 示例格式："做X。当Y发生或用户要求Z时调用。"
   - **语言**：默认使用英语，除非用户指定其他语言
3. 创建目录：`.trae/skills/<skill-name>/`
4. 创建 `SKILL.md` 并添加适当的前置内容和内容
5. 验证结构是否正确

## 示例
要创建一个 "code-reviewer" 技能：

```bash
mkdir -p .trae/skills/code-reviewer
```

然后创建 `.trae/skills/code-reviewer/SKILL.md`：

```markdown
---
name: "code-reviewer"
description: "Reviews code for best practices, bugs, and improvements. Invoke when user asks for code review or before merging changes."
---

# Code Reviewer

This skill reviews code and provides feedback...
```

## 最佳实践
- 技能名称应简洁明了
- 描述应准确反映技能的功能和使用场景
- 技能内容应结构清晰，易于理解
- 提供具体的使用示例和工作流程
- 保持技能文件的简洁性和专注性