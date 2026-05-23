; ModuleID = 'probe2.19db12de6e2a4738-cgu.0'
source_filename = "probe2.19db12de6e2a4738-cgu.0"
target datalayout = "e-m:e-p:32:32-p10:8:8-p20:8:8-i64:64-n32:64-S128-ni:1:10:20"
target triple = "wasm32-unknown-unknown"

; probe2::probe
; Function Attrs: nounwind
define dso_local void @_ZN6probe25probe17h2f41147b89c27188E() unnamed_addr #0 {
start:
  %0 = alloca [4 x i8], align 4
  store i32 -2147483648, ptr %0, align 4
  %_0.i = load i32, ptr %0, align 4
  ret void
}

; Function Attrs: nocallback nofree nosync nounwind speculatable willreturn memory(none)
declare i32 @llvm.bitreverse.i32(i32) #1

attributes #0 = { nounwind "target-cpu"="generic" }
attributes #1 = { nocallback nofree nosync nounwind speculatable willreturn memory(none) }

!llvm.ident = !{!0}

!0 = !{!"rustc version 1.80.0 (051478957 2024-07-21)"}
