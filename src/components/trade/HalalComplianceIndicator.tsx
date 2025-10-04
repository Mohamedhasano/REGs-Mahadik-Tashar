import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useHalalCompliance, getHalalStatusBadgeVariant } from "@/hooks/useHalalCompliance";
import { CheckCircle, XCircle, AlertCircle, Clock, Shield, BookOpen } from "lucide-react";
import { HalalStatus } from "@/types/halal";

interface HalalComplianceIndicatorProps {
  symbol: string;
  showDetails?: boolean;
  compact?: boolean;
}

const StatusIcon = ({ status }: { status: HalalStatus }) => {
  switch (status) {
    case "halal":
      return <CheckCircle className="h-4 w-4 text-accent" />;
    case "haram":
      return <XCircle className="h-4 w-4 text-destructive" />;
    case "questionable":
      return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    case "pending":
      return <Clock className="h-4 w-4 text-muted-foreground" />;
    default:
      return <Clock className="h-4 w-4 text-muted-foreground" />;
  }
};

export function HalalComplianceIndicator({ symbol, showDetails = false, compact = false }: HalalComplianceIndicatorProps) {
  const compliance = useHalalCompliance(symbol);

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1">
              <StatusIcon status={compliance.status} />
              <Badge variant={getHalalStatusBadgeVariant(compliance.status)} className="text-xs">
                {compliance.status}
              </Badge>
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <div className="space-y-2">
              <div className="font-medium">Halal Compliance: {compliance.status}</div>
              <div className="text-sm">Score: {compliance.complianceScore.toFixed(0)}%</div>
              {compliance.certifiedBy && (
                <div className="text-sm">Certified by: {compliance.certifiedBy}</div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (!showDetails) {
    return (
      <div className="flex items-center gap-2">
        <StatusIcon status={compliance.status} />
        <Badge variant={getHalalStatusBadgeVariant(compliance.status)}>
          {compliance.status.toUpperCase()}
        </Badge>
        <span className="text-sm text-muted-foreground">
          {compliance.complianceScore.toFixed(0)}% compliant
        </span>
      </div>
    );
  }

  return (
    <Card className="card-elevated">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Shield className="h-5 w-5 text-primary" />
          Halal Compliance Analysis
        </CardTitle>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StatusIcon status={compliance.status} />
            <Badge variant={getHalalStatusBadgeVariant(compliance.status)}>
              {compliance.status.toUpperCase()}
            </Badge>
          </div>
          <span className="text-sm text-muted-foreground">
            Last reviewed: {new Date(compliance.lastReviewed || Date.now()).toLocaleDateString()}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Compliance Score</span>
            <span className="text-sm text-muted-foreground">{compliance.complianceScore.toFixed(0)}%</span>
          </div>
          <Progress value={compliance.complianceScore} className="h-2" />
        </div>

        {compliance.certifiedBy && (
          <div className="flex items-center gap-2 p-3 bg-accent/10 rounded-lg">
            <BookOpen className="h-4 w-4 text-accent" />
            <span className="text-sm">Certified by: <strong>{compliance.certifiedBy}</strong></span>
          </div>
        )}

        <div>
          <h4 className="font-medium mb-3">Shariah Conditions</h4>
          <div className="space-y-2">
            {compliance.conditions.map((condition, index) => (
              <div key={index} className="flex items-start gap-3 p-2 rounded-lg bg-muted/30">
                {condition.isCompliant ? (
                  <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                ) : (
                  <XCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <div className="font-medium text-sm">{condition.name}</div>
                  <div className="text-xs text-muted-foreground">{condition.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3">Screening Rules</h4>
          <div className="space-y-2">
            {compliance.screeningRules.map((rule, index) => (
              <div key={index} className="p-2 rounded-lg bg-muted/30">
                <div className="font-medium text-sm">{rule.rule}</div>
                <div className="text-xs text-muted-foreground">{rule.description}</div>
                {rule.threshold && (
                  <div className="text-xs text-primary mt-1">Threshold: {rule.threshold}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}