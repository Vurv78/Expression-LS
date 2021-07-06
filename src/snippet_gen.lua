
local indent = 0
local out = {}

function emit(s)
	out[#out+1] = ('\t'):rep(indent) .. s
end

local function typeNameFromID(id)
	local maybe = wire_expression_types2[id]
	if maybe then return maybe[1] and maybe[1]:lower() or "void" end
	return "void"
end

emit("{")
indent = indent + 1

for signature, data in pairs(wire_expression2_funcs) do
	local data = wire_expression2_funcs[signature]
	emit('"' .. signature .. '": {')
	indent = indent + 1

	local fname = string.match(signature, "[^(]+", 1)
	emit('"scope": "source.e2",')
	emit('"prefix": "' .. fname .. '",')

	local param_names = data.argnames or {}
	for k, v in ipairs(param_names) do
		param_names[k] = (v:sub(1,1):upper() .. v:sub(2):lower())
	end

	emit('"description": "(' .. (data[4] or 20) .. ' OPS) function ' .. typeNameFromID(data[2]) .. ' ' .. fname .. '(' .. table.concat(param_names, ", ") .. ')",')
	local param_vscode_names = {}
	for k, v in ipairs(param_names) do
		param_vscode_names[k] = '${' .. k .. ":" .. v .. "}"
	end
	emit('"body": "' .. fname .. "(" .. table.concat(param_vscode_names, ", ") .. ')"')
	indent = indent - 1
	emit("},");
end

indent = indent - 1
emit("}")

local handle = file.Open("functions.json", "wb", "DATA")
handle:Write( table.concat(out, '\n') )
handle:Close()